using Plugin.Geolocator;
using Plugin.Geolocator.Abstractions;
using Plugin.Permissions;
using Plugin.Permissions.Abstractions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using Xamarin.Essentials;

namespace ThesisXam.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Location : ContentPage
    {
        public Location()
        {
            InitializeComponent();
            //checkPermission();
            locButton.Clicked += OnButtonClicked;
            //StartListening();
        }

        public void OnButtonClicked(object sender, EventArgs args)
        {
            label.Text = "Waiting for location";
            StartListening();
            //try
            //{
            //    Position position = await GetCurrentLocation();
            //    var output = string.Format("Time: {0} Lat: {1} Long: {2} Altitude: {3} Altitude Accuracy: {4} Accuracy: {5} Heading: {6} Speed: {7}",
            //position.Timestamp, position.Latitude, position.Longitude,
            //position.Altitude, position.AltitudeAccuracy, position.Accuracy, position.Heading, position.Speed);
            //    Debug.WriteLine(output);
            //    label.Text = output;
            //}
            //catch (Exception e)
            //{
            //    Debug.WriteLine(e);
            //}
        }

        public async Task<Position> GetCurrentLocation()
        {
            Position position = null;
            try
            {
                var locator = CrossGeolocator.Current;
                locator.DesiredAccuracy = 100;

                //position = await locator.GetLastKnownPositionAsync();

                if (position != null)
                {
                    //got a cahched position, so let's use it.
                    var output2 = string.Format("Time: {0} \nLat: {1} \nLong: {2} \nAltitude: {3} \nAltitude Accuracy: {4} \nAccuracy: {5} \nHeading: {6} \nSpeed: {7}",
                        position.Timestamp, position.Latitude, position.Longitude,
                        position.Altitude, position.AltitudeAccuracy, position.Accuracy, position.Heading, position.Speed);
                    label.Text = output2;
                    return position;
                }

                //var available = await locator.GetIsGeolocationAvailableAsync();
                var enabled = locator.IsGeolocationEnabled;
                if (!enabled)
                {
                    //not available or enabled
                    label.Text = "Not enabled";
                    return null;
                }

                position = await locator.GetPositionAsync(TimeSpan.FromSeconds(20), null, true);

            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error getting location {ex.Message}");
            }

            return position;


        }

        async void StartListening()
        {
            checkPermission();
            var locator = CrossGeolocator.Current;
            var enabled = locator.IsGeolocationEnabled && locator.IsGeolocationAvailable;
            if (!enabled)
            {
                label.Text = "Location not enabled";
                return;
            }
            if (CrossGeolocator.Current.IsListening)
                return;
            // Time between updates / Minimum distance / Include Heading
            await CrossGeolocator.Current.StartListeningAsync(TimeSpan.FromSeconds(0), 0, true);

            CrossGeolocator.Current.PositionChanged += PositionChanged;
            CrossGeolocator.Current.PositionError += PositionError;
        }

        async void checkPermission()
        {
            try
            {
                var status = await CrossPermissions.Current.CheckPermissionStatusAsync(Permission.Location);
                if (status != PermissionStatus.Granted)
                {
                    if (await CrossPermissions.Current.ShouldShowRequestPermissionRationaleAsync(Permission.Location))
                    {
                        //await DisplayAlert("Need location", "Need location", "OK");
                    }

                    var results = await CrossPermissions.Current.RequestPermissionsAsync(Permission.Location);
                    //Best practice to always check that the key exists
                    if (results.ContainsKey(Permission.Location))
                        status = results[Permission.Location];
                }

                if (status == PermissionStatus.Granted)
                {
                    label.Text = "Permission granted";
                }
                else if (status != PermissionStatus.Unknown)
                {
                    await DisplayAlert("Location Denied", "Permission denied", "OK");
                }
            }
            catch (Exception ex)
            {

                label.Text = "Error: " + ex;
            }
        }
        private void PositionChanged(object sender, PositionEventArgs e)
        {

            //If updating the UI, ensure you invoke on main thread
            var position = e.Position;
            var output = "Full: Lat: " + position.Latitude + " Long: " + position.Longitude;
            output += "\n" + $"Time: {position.Timestamp}";
            output += "\n" + $"Heading: {position.Heading}";
            output += "\n" + $"Speed: {position.Speed}";
            output += "\n" + $"Accuracy: {position.Accuracy}";
            output += "\n" + $"Altitude: {position.Altitude}";
            output += "\n" + $"Altitude Accuracy: {position.AltitudeAccuracy}";
            label.Text = output;
            Debug.WriteLine(output);
        }

        private void PositionError(object sender, PositionErrorEventArgs e)
        {
            Debug.WriteLine(e.Error);
        }

        async void StopListening()
        {
            if (!CrossGeolocator.Current.IsListening)
                return;

            await CrossGeolocator.Current.StopListeningAsync();

            CrossGeolocator.Current.PositionChanged -= PositionChanged;
            CrossGeolocator.Current.PositionError -= PositionError;
        }
    }

}
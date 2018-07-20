using Plugin.BLE;
using Plugin.BLE.Abstractions.Exceptions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ThesisXam.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Bluetooth : ContentPage
    {
        Plugin.BLE.Abstractions.Contracts.IDevice device;
        private const string DEVICE_UUID = "";
        private const string SERVICE_UUID = "b9e875c0-1cfa-11e6-b797-0002a5d5c51b";
        private const string CHAR_W_UUID = "0c68d100-266f-11e6-b388-0002a5d5c51b";
        private const string CHAR_N_UUID = "1ed9e2c0-266f-11e6-850b-0002a5d5c51b";

        public Bluetooth()
        {
            InitializeComponent();
            //ConnectAsync();
        }
        public async void ConnectAsync()
        {
            var ble = CrossBluetoothLE.Current;
            var status = ble.State;
            if (status == Plugin.BLE.Abstractions.Contracts.BluetoothState.Off) return;
            var adapter = CrossBluetoothLE.Current.Adapter;

            ble.StateChanged += (s, e) =>
            {
                Debug.WriteLine($"The bluetooth state changed to {e.NewState}");
            };

            adapter.DeviceDiscovered += (s, a) =>
            {
                device = a.Device;
                Debug.WriteLine($"Bluetooth found {device.Name}");
                adapter.StopScanningForDevicesAsync();
                label.Text = device.Name;
            };
            Debug.WriteLine("STARTING SCANNING");
            await adapter.StartScanningForDevicesAsync();
            try
            {
                Debug.WriteLine("CONNECTING TO DEVICE");
                await adapter.ConnectToDeviceAsync(device);
            }
            catch (DeviceConnectionException e)
            {
                Debug.WriteLine($"Error connecting: {e.Message}");
            }
            var service = await device.GetServiceAsync(Guid.Parse(SERVICE_UUID));
            Debug.WriteLine($"Services: {service}");
            var write = await service.GetCharacteristicAsync(Guid.Parse(CHAR_W_UUID));
            await write.WriteAsync(Encoding.ASCII.GetBytes("start"));
            var notify = await service.GetCharacteristicAsync(Guid.Parse(CHAR_N_UUID));
            notify.ValueUpdated += (o, args) =>
            {
                string text = Encoding.ASCII.GetString(args.Characteristic.Value);
                //Debug.WriteLine($"VALUE: {text}");
                Device.BeginInvokeOnMainThread(() =>
                {
                    label.Text = text;
                });

            };

            await notify.StartUpdatesAsync();
        }
    }
}
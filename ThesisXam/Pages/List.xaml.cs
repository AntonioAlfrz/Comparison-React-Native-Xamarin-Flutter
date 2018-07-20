using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ThesisXam.Pages
{
    public class Result
    {
        public List<Person> results { get; set; }
        public Info info { get; set; }
    }
    public class Info
    {
        public string seed { get; set; }
        public int results { get; set; }
        public int page { get; set; }
        public string version { get; set; }
    }
    public class Name
    {
        public string title { get; set; }
        public string first { get; set; }
        public string last { get; set; }
    }

    public class PersonLocation
    {
        public string street { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postcode { get; set; }
    }

    public class Login
    {
        public string username { get; set; }
        public string password { get; set; }
        public string salt { get; set; }
        public string md5 { get; set; }
        public string sha1 { get; set; }
        public string sha256 { get; set; }
    }

    public class Id
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class Picture
    {
        public string large { get; set; }
        public string medium { get; set; }
        public string thumbnail { get; set; }
    }

    public class Dob
    {
        public string date;
        public int age;
    }

    public class Person
    {
        public string gender { get; set; }
        public Name name { get; set; }
        public PersonLocation location { get; set; }
        public string email { get; set; }
        public Login login { get; set; }
        public Dob dob { get; set; }
        public Dob registered { get; set; }
        public string phone { get; set; }
        public string cell { get; set; }
        public Id id { get; set; }
        public Picture picture { get; set; }
        public string nat { get; set; }
    }

    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class List : ContentPage
    {
        static HttpClient client = new HttpClient();

        public List()
        {
            InitializeComponent();

            button.Clicked += async (sender, args) => {
                int number = Int16.Parse(entry.Text);
                var temp = await RefreshDataAsync(number);
                myList.ItemsSource = temp;
            };          
        }

        public async Task<List<Person>> RefreshDataAsync(int number)
        {
            HttpClient client = new HttpClient();
            string RestUrl = $"https://randomuser.me/api/?results={number}";
            var uri = new Uri(string.Format(RestUrl, string.Empty));
            try
            {
                HttpResponseMessage response = await client.GetAsync(RestUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    try
                    {
                        var temp = JsonConvert.DeserializeObject<Result>(content);
                        return temp.results;
                    }
                    catch (Exception exc)
                    {
                        Debug.WriteLine(exc);
                    }

                    
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
            }



            return new List<Person>();
        }
    }
}
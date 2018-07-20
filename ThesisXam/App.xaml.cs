using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

using Xamarin.Forms;

namespace ThesisXam
{
	public partial class App : Application
	{
		public App ()
		{
            Stopwatch sw = new Stopwatch();
            sw.Start();
            InitializeComponent();
            sw.Stop();
            Console.WriteLine("Elapsed={0}", sw.ElapsedMilliseconds);
            MainPage = new ThesisXam.Main();
            
		}

		protected override void OnStart ()
		{
			// Handle when your app starts
		}

		protected override void OnSleep ()
		{
			// Handle when your app sleeps
		}

		protected override void OnResume ()
		{
			// Handle when your app resumes
		}
	}
}

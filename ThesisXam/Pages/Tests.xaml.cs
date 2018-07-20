using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tesseract;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;



namespace ThesisXam.Pages
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class Tests : ContentPage
	{
        Stopwatch sw;

        public Tests ()
		{
			InitializeComponent ();
             sw = new Stopwatch();
            ocrButton.Clicked += async (sender, args) =>
            {
                string temp = entry.Text;
                sw.Start();
                string result = await Ocr();
                sw.Stop();
                Device.BeginInvokeOnMainThread(() =>
                {
                    try
                    {
                        time.Text = sw.ElapsedMilliseconds.ToString();
                        sw.Reset();
                    }
                    catch (Exception error)
                    {
                        Debug.WriteLine(error.Message);
                    }
                });
            };
        }

        void FibIter(object sender, EventArgs e)
        {
            int number = Int16.Parse(entry.Text);

            sw.Start();
            UInt64 result = fibonacciIterative(number);
            sw.Stop();
            Device.BeginInvokeOnMainThread(() =>
            {
                try
                {
                    time.Text = $"Result: {result.ToString()}\nTime(ms):{sw.Elapsed.TotalMilliseconds.ToString()}";
                    sw.Reset();
                }
                catch (Exception error)
                {
                    Debug.WriteLine(error.Message);
                }
            });
        }

        void FibRec(object sender, EventArgs e)
        {
            UInt64 number = UInt64.Parse(entry.Text);

            sw.Start();
            UInt64 result = fibonacciRecursive(number);
            sw.Stop();
            Device.BeginInvokeOnMainThread(() =>
            {
                try
                {
                    time.Text = $"Result: {result.ToString()}\nTime(ms):{sw.Elapsed.TotalMilliseconds.ToString()}";
                    sw.Reset();
                }
                catch (Exception error)
                {
                    Debug.WriteLine(error.Message);
                }
            });
        }

        void PowMat(object sender, EventArgs e)
        {
            int number = Int32.Parse(entry.Text);

            sw.Start();
            matriMul(number);
            sw.Stop();
            Device.BeginInvokeOnMainThread(() =>
            {
                try
                {
                    time.Text = $"Time(ms):{sw.Elapsed.TotalMilliseconds.ToString()}";
                    sw.Reset();
                }
                catch (Exception error)
                {
                    Debug.WriteLine(error.Message);
                }
            });
        }

        void DoPrimes(object sender, EventArgs e)
        {
            int number = Int32.Parse(entry.Text);

            sw.Start();
            bool[] result = primes(number);
            sw.Stop();
            StringBuilder builder = new StringBuilder();
            for (int i=0; i < result.Length; i++)
            {
                if (result[i]) builder.Append(i.ToString()).Append(", ");
            }
            Device.BeginInvokeOnMainThread(() =>
            {
                try
                {
                    time.Text = $"Time(ms):{sw.Elapsed.TotalMilliseconds.ToString()}\nResult: {builder}";
                    sw.Reset();
                }
                catch (Exception error)
                {
                    Debug.WriteLine(error.Message);
                }
            });
        }

        int isEven(int n)
        {
            return n % 2 == 0 ? 1 : -1;
        }
        double[,] subMat(double[,] mat, int row, int column)
        {
            double[,] temp = new double [mat.GetLength(0), mat.GetLength(1)];
            int r = -1;
            for (int i = 0; i < mat.Length - 1; i++)
            {
                if (i == row)
                    continue;
                r++;
                int c = -1;
                for (int j = 0; j < mat.Length - 1; j++)
                {
                    if (j == column)
                        continue;
                    temp[r, ++c] = mat[i, j];
                }
            }
            return temp;
        }

        double determinant(double[,] mat)
        {
            double sum = 0.0;
            for (int i = 0; i < mat.GetLength(0) - 1; i++)
            {
                sum += isEven(i) * mat[0, i] * determinant(subMat(mat, 0, i));
            }
            return sum;
        }

        double[,] Adj(double[,] matr)
        {
            int n = matr.GetLength(0);
            double[,] result = new double[n, n];
            // Creat random matrix
            Random rnd = new Random();
            for (int i = 0; i < n-1; i++)
            {
                for (int j = 0; i < n-1; i++)
                {
                    matr[i, j] = rnd.NextDouble();
                }
            }
            for (int i = 0; i < n-1; i++)
            {
                for (int j = 0; j < n-1; j++)
                {
                    result[i,j] = 
                    result[i, j] = isEven(i) * isEven(j) *determinant(subMat(matr, i, j));
                }
            }
            return result;
        }

        async Task<string> Ocr()
        {
            ITesseractApi api = DependencyService.Get<ITesseractService>().Init();
            await api.Init("spa");
            string file = "/storage/emulated/0/Android/data/mydata/textSpaCrop.png";
            await api.SetImage(file);
            return api.Text;      
        }

        bool primalityTest(long n)
        {
            if (n == 2) return true;
            if (n % 2 == 0) return false;
            double squareRoot = Math.Sqrt(n);
            int i = 3;
            while (i <= squareRoot)
            {
                if (n % i == 0)
                {
                    return false;
                }
                i += 2;
            }
            return true;
        }

        void matriMul(int n)
        {
            double[,] matr = new double[n, n];
            Random rnd = new Random();
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    matr[i, j] = rnd.NextDouble();
                }
            }
            double[,] result = (double[,])matr.Clone();
            for (int a = 0; a < n; a++)
            {
                double[,] temp = (double[,])result.Clone();
                for (int i = 0; i < n; i++)
                {
                    for (int j = 0; j < n; j++)
                    {
                        double sum = 0;
                        for (int k = 0; k < n; k++)
                        {
                            sum += matr[i, k] * temp[k, j];
                        }
                        result[i, j] = sum;
                    }
                }
            }
        }

        bool[] primes(int n)
        {
            bool[] arr = new bool[n];
            for (int i = 0; i < n; i++)
            {
                arr[i] = true;
            }
            for (int i = 2; i < Math.Sqrt(n); i++)
            {
                if (arr[i])
                {
                    int temp = (int)Math.Pow(i, 2);
                    for (int j = 1; temp < n; j++)
                    {
                        arr[temp] = false;
                        temp = (int)Math.Pow(i, 2) + j * i;
                    }
                }
            }
            return arr;
        }

        UInt64 fibonacciRecursive(UInt64 n)
        {
            if (n <= 1)
            {
                return n;
            }
            return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
        }

        UInt64 fibonacciIterative(int n)
        {
            UInt64 max = UInt64.MaxValue;
            if (n <= 1)
            {
                return (UInt64)n;
            }
            UInt64 fib = 1;
            UInt64 prevFib = 1;

            for (int i = 2; i < n; i++)
            {
                UInt64 temp = fib;
                fib += prevFib;
                prevFib = temp;
            }
            return fib;
        }
    }
}
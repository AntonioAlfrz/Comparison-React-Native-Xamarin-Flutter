using System;
using System.Collections.Generic;
using System.Text;
using Tesseract;

namespace ThesisXam
{
    public interface ITesseractService
    {
        ITesseractApi Init();
    }
}

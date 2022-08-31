

using ImageMagick;
using System.Text;
using System.Text.RegularExpressions;

namespace Kiltex.SistemaGestion.SDK
{
    public class ImagesTool
    {
        /// <summary>
        /// Comprime una imagen
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public static bool CompressImage(string imagePath)
        {
            var optimizer = new ImageOptimizer();
            return optimizer.Compress(imagePath);
        }

        public static bool ResizeImage(int maxWidth, string imagePath, string imageDest)
        {
            if (!imagePath.Contains(".jpg"))
            {
                File.Copy(imagePath, imageDest);
                return true;
            }

            using var image = new MagickImage(imagePath);

            if (image.Width > maxWidth)
            {
                var ratio = ((maxWidth * 100.0) / (image.Width * 1.0));
                image.Resize(new Percentage(ratio));
                image.Write(imageDest);
            }

            return true;
        }

        public static bool ResizeImage(int maxWidth, Stream file, string name)

        {
            if (!name.Contains(".jpg"))
            {
                return true;
            }

            file.Position = 0;

            using var image = new MagickImage(file);

            if (image.Width > maxWidth)
            {
                var ratio = ((maxWidth * 100.0) / (image.Width * 1.0));
                image.Resize(new Percentage(ratio));
                image.Write(file);
                return true;
            }

            return true;
        }

        public static bool ChangeQuality(Stream file, string name, int percent)
        {
            if (!name.Contains(".jpg"))
            {
                return true;
            }

            file.Position = 0;

            using MagickImage image = new(file);
            image.Format = MagickFormat.Jpeg;
            image.Quality = percent;
            image.Write(file);
            return true;
        }


        public static bool ChangeQuality(string imagePath, string imageDest, int percent)
        {
            if (!imagePath.Contains(".jpg"))
            {
                return true;
            }
            using MagickImage sprite = new(imagePath);
            sprite.Format = MagickFormat.Jpeg;
            sprite.Quality = percent;
            sprite.Write(imageDest);
            return true;
        }

        public static int GetHeightResize(MagickImage image, int width)
        {
            var ratio = 1 - ((image.Width * 1.0) / (width * 1.0));
            return (int)(image.Height * ratio);
        }

        public static string GenerateSlug(string name, string prefix)
        {
            string phrase = string.Format("{0}{1}", prefix, name);
            string str = RemoveAccent(phrase).ToLower();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 150 ? str.Length : 150).Trim();
            str = Regex.Replace(str, @"\s", "-");
            return str;
        }


        private static string RemoveAccent(string text)
        {
            if (!text.IsNormalized(NormalizationForm.FormKD))
            {
                text = text.Normalize(NormalizationForm.FormKD);
            }

            byte[] bytes = Encoding.GetEncoding("Cyrillic").GetBytes(text);
            return Encoding.ASCII.GetString(bytes);
        }


    }
}

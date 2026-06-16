using System.IO;
using System.Threading.Tasks;

namespace ReviewLoom.Application.Interfaces;

public interface IMediaService
{
    /**
     * Uploads an image and returns the public URL
     */
    Task<string> UploadImageAsync(Stream fileStream, string fileName);
}

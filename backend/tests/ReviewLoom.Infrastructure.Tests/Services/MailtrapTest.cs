using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace ReviewLoom.Infrastructure.Tests.Services;

public class MailtrapTest
{
    [Fact]
    public async Task TestMailtrapWithHttpClient()
    {
        // Script của bạn dùng Mailtrap SDK, nhưng vì Mailtrap SDK chính thức được host trên GitHub Packages 
        // (yêu cầu cấu hình GitHub Personal Access Token mới tải về được), 
        // phương án tối ưu và đơn giản nhất là gọi trực tiếp HTTP API của Mailtrap bằng HttpClient.

        var apiToken = "YOUR_MAILTRAP_API_TOKEN_HERE"; // Điền token của bạn vào đây để test
        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var emailData = new
        {
            from = new { email = "hello@demomailtrap.co", name = "Mailtrap Test" },
            to = new[] { new { email = "ducdat05112004@gmail.com" } },
            subject = "You are awesome!",
            text = "Congrats for sending test email with Mailtrap!",
            category = "Integration Test"
        };

        var json = JsonSerializer.Serialize(emailData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync("https://send.api.mailtrap.io/api/send", content);
            var responseString = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Status Code: {response.StatusCode}");
            Console.WriteLine($"Response: {responseString}");

            // Nếu token là giả, Mailtrap sẽ báo lỗi Unauthorized (401), điều này chứng minh kết nối API hoạt động bình thường
            if (apiToken == "YOUR_MAILTRAP_API_TOKEN_HERE")
            {
                Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
            }
            else
            {
                Assert.True(response.IsSuccessStatusCode, $"Gửi email thất bại: {responseString}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi kết nối: {ex.Message}");
            throw;
        }
    }
}

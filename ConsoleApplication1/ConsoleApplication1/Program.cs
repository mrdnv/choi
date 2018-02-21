using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {          
                //MailMessage mail = new MailMessage(new MailAddress("noreply@friso.com.vn"), new MailAddress("vu.do@sai-digital.com"));
                //mail.Sender = new MailAddress("noreply@friso.com.vn");
                //mail.IsBodyHtml = true;
                //mail.Subject = "this is a test email.";
                //mail.Body = "this is my test email body";


                //SmtpClient client = new SmtpClient();
                //client.DeliveryMethod = SmtpDeliveryMethod.Network;
                //client.UseDefaultCredentials = false;
                //client.Credentials = new NetworkCredential("dat@vht.com.vn", "Mv_d_LuM1JBY2O_EqGe_xQ");
                //client.EnableSsl = true;
                //client.Port = 587;
                //client.Host = "smtp.mandrillapp.com";
                //client.Send(mail);

                CDO.Message oMsg = new CDO.Message();
                CDO.IConfiguration iConfg;

                iConfg = oMsg.Configuration;

                ADODB.Fields oFields;
                oFields = iConfg.Fields;

                // Set configuration.
                ADODB.Field oField = oFields["http://schemas.microsoft.com/cdo/configuration/sendusing"];
                oField.Value = 2;

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/smtpserver"];
                oField.Value = "smtp.mandrillapp.com";

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/smtpserverport"];
                oField.Value = 587;

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/smtpauthenticate"];
                oField.Value = 1;

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/sendusername"];
                oField.Value = "dat@vht.com.vn";

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/sendpassword"];
                oField.Value = "Mv_d_LuM1JBY2O_EqGe_xQ";

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/smtpusessl"];
                oField.Value = false;

                oField = oFields["http://schemas.microsoft.com/cdo/configuration/subject"];
                oField.Value = "test";

                oFields.Update();

                // Set common properties from message.

                oMsg.TextBody = "test";


                //String sHtml;
                //sHtml = "<HTML>\n" +
                //    "<HEAD>\n" +
                //    "<TITLE>Sample GIF</TITLE>\n" +
                //    "</HEAD>\n" +
                //    "<BODY><P>\n" +
                //    "<h1><Font Color=Green>Inline graphics</Font></h1>\n" +
                //    "</BODY>\n" +
                //    "</HTML>";

                oMsg.HTMLBody = "";
                oMsg.HTMLBodyPart.Charset = "UTF-8";
                oMsg.BodyPart.Charset = "UTF-8";

                //TOTO: To send WEb page in an e-mail, uncomment the following lines and make changes in TODO section.
                //TODO: Replace with your preferred Web page
                //oMsg.CreateMHTMLBody("http://www.microsoft.com",
                //	CDO.CdoMHTMLFlags.cdoSuppressNone, 
                //	"", ""); 
                oMsg.Subject = "test";


                //TODO: Change the To and From address to reflect your information.                       
                oMsg.From = "dat@vht.com.vn";
                oMsg.To = "vu.do@sai-digital.com";
                //ADD attachment.
                //TODO: Change the path to the file that you want to attach.
                //oMsg.AddAttachment("C:\\Hello.txt", "", "");
                //oMsg.AddAttachment("C:\\Test.doc", "", "");
                oMsg.Send();
            }
            catch (Exception)
            {
                
                throw;
            }
     
        }
    }
}

using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class EmailService : BaseService
    {

        private IConfiguration _config;
        public EmailService(ErrorManager logger, DBContext context, IMapper maper, IConfiguration config) :
          base(logger, context, maper)
        {
            _config = config;
        }
        ///Email General

        public async Task<OperationResponse<string>> SendEmail(string emailTo, string subject, string htmlBody, string plainBody = "")
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(emailTo));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();
            smtp.Connect(_config.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config.GetSection("EmailUsername").Value, _config.GetSection("EmailPassword").Value);
            var response = smtp.Send(email);
            smtp.Disconnect(true);
            return new OperationResponse<string>(response.ToString());
        }

        ///Email de orden

        public async Task<OperationResponse<string>> SendOrder(List<string> emails, string supplierName, string orderNumber, string date, bool paid, List<DtoResponseOrderByIdDetail> details)
        {

            StringBuilder detallesCollection = new(2000);
            foreach (var detail in details)
            {
                detallesCollection.Append($"<tr><td>{detail.ProductName}</td><td>{detail.ProductCode}</td><td>{detail.OrderedQuantity}</td><td>{detail.ProductPrice}</td></tr>");
            }
          
            var emailBody = "<html> " +
                            "<head> " +
                            "<style>" +
                            ".table, th, td {width: 30%; align-items:center; border: 1px solid black;}" +
                            "</style> " +
                            "</head>" +
                             "<body>" +
                            "<h1>Pedido enviado</h1>" +
                            "<h3> Hola, " +
                           $"{supplierName}" +
                            "!</br> " +
                            "Enviamos a continuación el pedido numero: " +
                           $"{orderNumber}" +
                            "</h3>" +
                            "<p> El <strong>pedido</strong> esta: @@paid@@ " +
                            "</p>" +
                            "<p> <strong>Fecha:</strong> " +
                           $"{date}" +
                            "</p>" +
                            "<table>" +
                            "<tr><th> Producto </th><th> Codigo </th><th> Cantidad </th><th> Precio </th></tr>" +
                           $"{detallesCollection}" +
                            "</table>"+
                            "<p> Esperamos su respuesta.</p>" +
                            "<p> Saludos! </p>" +
                            "</body>";


            emailBody = emailBody.Replace("@@paid@@", paid ? "Pago" : "No pago");

            foreach (var item in emails)
            {
                await SendEmail(item, "Envio de Pedido", emailBody);
            }   
        
                return new OperationResponse<string>("Ok");
            
        }

    }
}

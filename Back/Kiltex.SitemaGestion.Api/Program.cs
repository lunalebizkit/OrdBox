using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.SDK.Extension.Jwt;
using Kiltex.SistemaGestion.Services.Mapper;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var logger = new LoggerConfiguration()
  .ReadFrom.Configuration(builder.Configuration)
  .Enrich.FromLogContext()
  .CreateLogger();
//builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

var connectionString = builder.Configuration.GetConnectionString("sqlconnection");
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Kiltex.GestionStock.Api", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            System.Array.Empty<string>()

                    }
                });
});

builder.Services.AddAutoMapper(typeof(UserMapperProfile));
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RolService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<BrandService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddSingleton<ErrorManager>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<EntityService>();
builder.Services.AddScoped<SupplierOrderService>();
builder.Services.AddDbContext<DBContext>(x => x.UseSqlServer(connectionString));
builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowAll", builder =>
       builder.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
   });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearerConfiguration(
 builder.Configuration["Jwt:Issuer"],
 builder.Configuration["Jwt:Audience"],
 builder.Configuration["Jwt:SecretKey"]);
builder.Services.AddApiVersioning(o =>
{
    o.ReportApiVersions = true;
    o.AssumeDefaultVersionWhenUnspecified = true;
    o.DefaultApiVersion = new ApiVersion(1, 0);
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

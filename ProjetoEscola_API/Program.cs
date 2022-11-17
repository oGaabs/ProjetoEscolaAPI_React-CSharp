using Microsoft.EntityFrameworkCore;
using ProjetoEscola_API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

//Allow CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        MyAllowSpecificOrigins,
        builder =>
        {
            builder
                .WithOrigins("http://localhost")
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost");
            builder.SetIsOriginAllowed(origin => true);
        }
    );
});

// Adding Authentication
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    // Adding Jwt Bearer
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = configuration["JWT:ValidAudience"],
            ValidIssuer = configuration["JWT:ValidIssuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["JWT:Secret"])
            )
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<EscolaContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("StringConexaoSQLServer"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

//Allow CORS
app.UseCors(MyAllowSpecificOrigins);

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

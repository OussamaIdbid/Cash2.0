using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CashModel;
using CashUI;
using Blazored.Modal;
using Blazored.Toast;
using Blazorise;
using Blazorise.Bootstrap;
using Blazorise.Icons.FontAwesome;
using Blazored.LocalStorage;

namespace WebAppCash
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
            services.AddServerSideBlazor();

            services
              .AddBlazorise(options =>
              {
                  options.ChangeTextOnKeyPress = true; // optional
                })
              .AddBootstrapProviders()
              .AddFontAwesomeIcons();



            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITableService, TableService>();
            services.AddScoped<IOperationService, OperationService>();
            services.AddScoped<IOrderitemService, OrderitemService>();
            services.AddScoped<IOrderService,OrderService>();
            services.AddScoped<IOptionService, OptionService>();
            services.AddScoped<IOptionOrderlineService, OptionOrderlineService>();


            var sqlConnectionConfiguration = new SqlConnectionConfiguration(Configuration.GetConnectionString("SqlDbContext"));
            services.AddSingleton(sqlConnectionConfiguration);
            services.AddBlazoredModal();
            services.AddBlazoredToast();
            services.AddBlazoredLocalStorage(config =>
            config.JsonSerializerOptions.WriteIndented = true);
        }   


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();


            app.UseRouting();

            app.ApplicationServices
                .UseBootstrapProviders()
                 .UseFontAwesomeIcons();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapBlazorHub();
                endpoints.MapFallbackToPage("/_Host");
            });
        }
    }
}

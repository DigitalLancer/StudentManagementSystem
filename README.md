# Öğrenci Otomasyon Sistemi

## Proje Açıklaması
Bu proje; öğrencilerin, öğretmenlerin ve yöneticilerin sisteme giriş yaparak ders, not, devamsızlık ve kullanıcı yönetimi işlemlerini gerçekleştirebildiği full-stack bir **öğrenci otomasyon sistemi**dir.  

🚀 Canlı Demo: [https://studentautomanager.netlify.app/](https://your-app-name.netlify.app)

- **Frontend**: React  
- **Backend**: ASP.NET Core 9 (C#)  
- **Database**: PostgreSQL  
- **Deployment**:  
  - Backend + Database → AWS Ubuntu sunucusu  
  - Frontend → Netlify

## 🎯 Bonus Görevler

- Backend ve PostgreSQL database AWS üzerinde canlıya alındı.
- Frontend Netlify üzerinden deploy edildi.

## Kurulum
### 1. Repository'yi klonlayın
```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```
### 2. Backend klasörüne gidin:
```bash
cd StudentManagement.Api
```
### 3. Veritabanı bağlantısını ayarlayın (appsettings.json):
```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=StudentManagementDB;Username=postgres;Password=yourpassword"
  }
}
```
### 4. Backend'i başlatın:
```bash
dotnet run
```

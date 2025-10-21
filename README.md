# BR Services - Real Estate Website

A multilingual real estate website for BR Services, built with Firebase and vanilla JavaScript.

## Live Website

**Homepage:** https://brservices.ch
**Admin Panel:** https://brservices.ch/admin.html

## Features

- Multi-language support (Portuguese, German, English)
- Property listing and management
- Admin panel for CRUD operations
- Firebase Authentication, Firestore & Storage integration
- Responsive design
- Contact forms and WhatsApp integration
- Image upload and management

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Languages:** Portuguese (PT), German (DE), English (EN)

## Project Structure

```
.
├── index.html              # Homepage with property listings
├── admin.html              # Admin panel for property management
├── css/
│   ├── styles.css         # Homepage styles
│   └── admin.css          # Admin panel styles
├── js/
│   ├── main.js            # Homepage logic
│   └── translations.js    # Multi-language translations
├── assets/
│   └── logo.png           # Company logo
├── DEPLOY.md              # Deployment instructions
└── README.md              # This file
```

## Getting Started

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/Wilhofstrasse/pastel-brutalist-playground.git
cd pastel-brutalist-playground
```

2. Open the files in your browser:
   - Open `index.html` in a web browser for the homepage
   - Open `admin.html` for the admin panel

3. For live development, use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

## Firebase Configuration

The project uses Firebase with inline configuration in both HTML files:

**Project:** real-estate-recife
**API Key:** AIzaSyCeg-p2HMp2YHwSXg_ulDxBkHmb6h-2ahU
**Auth Domain:** real-estate-recife.firebaseapp.com
**Project ID:** real-estate-recife

**Authorized Domain:** brservices.ch

**Services Enabled:**
- Authentication (Email/Password)
- Firestore Database
- Storage

## Admin Credentials

**Email:** us@filipeandrade.com
**Password:** Abel1234

## Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions to cPanel/shared hosting.

### Quick Deployment Steps:

1. Upload all files to your web server's public directory
2. Ensure Firebase configuration is correct
3. Clear browser cache
4. Test homepage and admin panel

## Configuration

### WhatsApp Number

Update the WhatsApp number in `index.html` (search for the phone number in the contact section)

### Social Media Links

Update social media links in the footer section of `index.html`

### Languages

Edit translations in `js/translations.js` to add or modify language content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

If you encounter issues:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private browsing mode
3. Check browser console (F12) for errors
4. Verify all files uploaded correctly
5. Ensure Firebase configuration is valid

## Contributing

This is a private project. For any changes or improvements, please contact the project owner.

## License

Private - All rights reserved

## Contact

For support or questions, contact: us@filipeandrade.com

---

Built with care for BR Services Real Estate

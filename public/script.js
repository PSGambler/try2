function changeLanguage(language) {
    // Pobieramy dane z pliku translations.json
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            // Zmieniamy tekst na stronie zgodnie z wybranym językiem
            document.getElementById('header-title').innerText = translations[language].headerTitle;
            document.getElementById('nav-about').innerText = translations[language].navAbout;
            document.getElementById('nav-specs').innerText = translations[language].navSpecs;
            document.getElementById('nav-gallery').innerText = translations[language].navGallery;
            document.getElementById('nav-contact').innerText = translations[language].navContact;
            document.getElementById('about-title').innerText = translations[language].aboutTitle;
            document.getElementById('about-invited').innerText = translations[language].aboutInvited;
            document.getElementById('about-thanks').innerText = translations[language].aboutThanks;
            // Nadpisujemy całą treść o motocyklach (long description) w odpowiednim elemencie
            document.getElementById('about-text').innerText = translations[language].aboutText; // Możesz również użyć `innerHTML`, jeśli w tekście masz HTML

            document.getElementById('specs-title').innerText = translations[language].specsTitle;
            const specsList = document.getElementById('specs-list');
            specsList.innerHTML = '';  // Czyścimy aktualną listę specyfikacji
            translations[language].specsList.forEach(spec => {
                const li = document.createElement('li');
                li.innerText = spec;
                specsList.appendChild(li);
            });

            document.getElementById('specs-link').innerText = translations[language].specsLink;

            document.getElementById('motorcycle-gallery-title').innerText = translations[language].motorcycleGalleryTitle;
            document.getElementById('motorcycle-link').innerText = translations[language].motorcycleLink;

            document.getElementById('newsletter-title').innerText = translations[language].newsletterTitle;
            document.getElementById('newsletter-name-label').innerText = translations[language].newsletterNameLabel;
            document.getElementById('newsletter-email-label').innerText = translations[language].newsletterEmailLabel;
            document.getElementById('newsletter-button').innerText = translations[language].newsletterButton;

            document.getElementById('footer-text').innerHTML = translations[language].footerText;  // Uwzględniamy HTML w stopce
        })
        .catch(error => console.error('Błąd przy ładowaniu tłumaczeń:', error));
}

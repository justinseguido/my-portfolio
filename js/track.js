/* Lead tracking for GA4, loaded on every page.
   Sends two events that are marked as key events in GA4:
   - book_call_click: a click on any link that leads to the booking calendar
   - contact_click: a click on email, LinkedIn, Upwork, Fiverr, the HighLevel directory, WhatsApp or phone
   Completed bookings are tracked separately on booking-confirmed.html (booking_completed). */
(function () {
  function send(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else {
      // gtag.js not loaded yet: queue the command so it is sent once it loads.
      // gtag.js only reads arguments objects, not plain arrays.
      window.dataLayer = window.dataLayer || [];
      (function () { window.dataLayer.push(arguments); })('event', name, params);
    }
  }

  function contactMethod(href) {
    if (/^mailto:/i.test(href)) return 'email';
    if (/^tel:/i.test(href)) return 'phone';
    if (/wa\.me|whatsapp\.com/i.test(href)) return 'whatsapp';
    if (/linkedin\.com/i.test(href)) return 'linkedin';
    if (/upwork\.com/i.test(href)) return 'upwork';
    if (/fiverr\.com/i.test(href)) return 'fiverr';
    if (/directory\.gohighlevel\.com/i.test(href)) return 'ghl_directory';
    return '';
  }

  function isBookingLink(href) {
    return /widget\/booking\//i.test(href) || /#(contact|book)$/i.test(href);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var params = {
      link_url: link.href || href,
      link_text: (link.textContent || '').trim().substring(0, 50),
      page_path: location.pathname
    };

    if (isBookingLink(href)) {
      params.button = link.getAttribute('data-track') || link.className || 'link';
      send('book_call_click', params);
      return;
    }

    var method = contactMethod(href);
    if (method) {
      params.method = method;
      send('contact_click', params);
    }
  }, true);
})();

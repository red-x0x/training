

import Alpine from 'alpinejs'
import Toastify from 'toastify-js';
import emailjs from '@emailjs/browser';

import "toastify-js/src/toastify.css";

window.Alpine = Alpine
window.emailjs = emailjs

/*

Toastify({
  text: "This is a toast",
  duration: 3000,
  destination: "https://github.com/apvarun/toastify-js",
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "left", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  },
  onClick: function(){} // Callback after click
}).showToast();



emailjs.send("service_zwphzhk","template_4m11eyc",{
    email: "tychiquedunia0@gmail.com",
    name: "Tychique",
    alias: "test",
    phone: 7881885290,
    reason: "hello",
});

*/

window.addEventListener('alpine:init', function (e) {
    emailjs.init('JsCYv5tknq9Yrh4J8');

    Alpine.data('app', () => ({
        formData: {
            name: '',
            alias: '',
            email: '',
            phone: '',
            reason: ''
        },

        targetDate: null,

        required: ['name', 'email', 'phone', 'reason'],

        toast: {
            duration: 4000,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        },

        countdown: {
            d: '0',
            h: '00',
            m: '00',
            s: '00'
        },

        started: false,

        timer: null,

        loading: true,
        initialize(datetime) {
            this.loading = false;
            this.targetDate = new Date(datetime);  
            this.startCountdown();          
        },

        startCountdown(){
            this.timer = window.setInterval(() => {
                const now = new Date();
                const delta = this.targetDate - now;
                if (delta <= 0) {
                    window.clearInterval(this.timer);
                    this.started = true;
                    return;
                }
                this.countdown.d = Math.floor(delta / (1000 * 60 * 60 * 24));
                this.countdown.h = String(Math.floor((delta / (1000 * 60 * 60)) % 24)).padStart(2, '0');
                this.countdown.m = String(Math.floor((delta / 1000 / 60) % 60)).padStart(2, '0');
                this.countdown.s = String(Math.floor((delta / 1000) % 60)).padStart(2, '0');
            }, 1000);
        },

        isRequire(field) {
            return this.required.includes(field ?? 'unknown');
        },

        async send(e) {
            e.preventDefault();
            this.loading = true;
            try {
                this.required.forEach(field => {
                    if (this.formData[field].trim() === '') {
                        throw ReferenceError(`Le champ *${field} est vide!`)
                    }
                })
                await emailjs.send('service_zwphzhk', 'template_4m11eyc', this.formData);
                Object.assign(this.toast, {
                    text: "Success: Candidature envoyer",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                });
                Toastify(this.toast).showToast();
                this.$refs.form.reset();
            } catch (error) {
                Object.assign(this.toast, {
                    text: `Erreur: ${error.message}`,
                    style: {
                        background: "linear-gradient(90deg,rgba(217, 20, 20, 1) 27%, rgba(245, 86, 0, 1) 75%, rgba(237, 168, 83, 1) 100%)",
                    }
                });
                Toastify(this.toast).showToast();
            } finally {
                this.loading = false;
            }
        }
    }))

})
Alpine.start()
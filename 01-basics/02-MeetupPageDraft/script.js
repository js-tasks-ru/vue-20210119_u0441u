import Vue from './vue.esm.browser.js';
const API_URL = 'https://course-vue.javascript.ru/api';
const fetchMeetups = () =>
  fetch( API_URL + '/meetups').then((res) => res.json());
/** URL адрес API */

/** ID митапа для примера; используйте его при получении митапа */
const MEETUP_ID = 6;

/**
 * Возвращает ссылку на изображение по идентификатору, например, изображение митапа
 * @param imageId {number} - идентификатор изображения
 * @return {string} - ссылка на изображение
 */
function getImageUrlByImageId(imageId) {
  return `${API_URL}/images/${imageId}`;
}

/**
 * Функция, возвращающая словарь заголовков по умолчанию для всех типов пунктов программы
 */
const getAgendaItemDefaultTitles = () => ({
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
});

/**
 * Функция, возвращая словарь иконок для для всех типов пунктов программы.
 * Соответствует имени иконок в директории /assets/icons
 */
const getAgendaItemIcons = () => ({
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
});

export const app = new Vue({
  //el: '#app',

  data() {
    return {
      RawMeetups: null, // Требуется хранить данные митапа
    };
  },

  mounted() {
    fetchMeetups().then((meetups) => {
      this.RawMeetups = [];
      meetups.forEach((meetup) => this.fetchRawMeetup(meetup.id).then((meetup) => this.RawMeetups.push(meetup)));
    }); // Требуется получить данные митапа с API
  },

  computed: {
    meetups: function() {
      return !this.RawMeetups ? null : this.RawMeetups.map(
        (meetup) => (
          {
            ...meetup,
            date: new Date(meetup.date),
            cover: meetup.imageId
              ? `https://course-vue.javascript.ru/api/images/${meetup.imageId}` : null,
            coverStyle: meetup.imageId
              ? {
                '--bg-url': `url(https://course-vue.javascript.ru/api/images/${meetup.imageId})`,
              }
              : undefined,
            localDate: new Date(meetup.date).toLocaleString(navigator.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            dateOnlyString: new Date(meetup.date).toISOString().split('T')[0],
            agenda: meetup.agenda.map(
              (agenda) => (
                {
                  ...agenda,
                  prettyType: this.agendaItemTitles()[agenda.type],
                  prettyIcon:  this.agendaItemIcons()[agenda.type]
                }
              )
            )
          }
        )
      );
    }
  },

// Возможно, здесь помогут вычисляемые свойства

  methods: {
    fetchRawMeetup(id) {
      return fetch( `${API_URL}/meetups/${id}`).then((res) => res.json());
    },

    meetupCover() {
      return this.meetup.imageId ? getImageUrlByImageId(this.meetup.imageId) : null;
    },

    agendaItemTitles() {
      return getAgendaItemDefaultTitles();
    },
    agendaItemIcons() {
      return getAgendaItemIcons();
    }
  }
});

app.$mount('#app');

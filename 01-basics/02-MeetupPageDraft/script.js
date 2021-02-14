import Vue from './vue.esm.browser.js';

/** URL адрес API */
const API_URL = 'https://course-vue.javascript.ru/api';

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
  el: '#app',

  data() {
    return {
      rawMeetup: null,
    };
  },

  mounted() {
    this.rawMeetup = this.fetchMeetup();
  },

  computed: {
    meetup() {
      // Требуется помнить о том, что изначально митапа может не быть.
      // В этом случае и вычисляемый митап - это null.
      if (this.rawMeetup === null) {
        return null;
      }

      return {
        ...this.rawMeetup,

        cover: this.rawMeetup.imageId
          ? getImageUrlByImageId(this.rawMeetup.imageId)
          : undefined,

        date: new Date(this.rawMeetup.date),

        localDate: new Date(this.rawMeetup.date).toLocaleString(
          navigator.language,
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ),

        dateOnlyString: new Date(this.rawMeetup.date)
          .toISOString()
          .split('T')[0],

        agenda: this.rawMeetup.agenda.map((agendaItem) => ({
          ...agendaItem,
          icon: `icon-${getAgendaItemIcons()[agendaItem.type]}.svg`,
          title:
            agendaItem.title || getAgendaItemDefaultTitles()[agendaItem.type],
        })),
      };
    },
  },

  methods: {
    async fetchMeetup() {
      this.rawMeetup = await fetch(
        `${API_URL}/meetups/${MEETUP_ID}`,
      ).then((res) => res.json());
    },
  },
});

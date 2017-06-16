import { Injectable, LOCALE_ID, Inject } from '@angular/core';

@Injectable()
export class I18nService {

  private translations: any = {
    en: {
      daysMomentConfig: {
        lastDay: '[Yesterday]',
        sameDay: 'HH:mm',
        nextDay: '[Tomorrow]',
        lastWeek: 'dddd',
        nextWeek: 'dddd',
        sameElse: 'Do [of] MMMM'
      },
      reportListingReasons: [
        {id: 1, label: 'Wrong category'},
        {id: 2, label: 'People or animals'},
        {id: 3, label: 'Joke'},
        {id: 4, label: 'Fake item'},
        {id: 5, label: 'Explicit content'},
        {id: 7, label: 'Food'},
        {id: 8, label: 'Drugs or medicines'},
        {id: 6, label: 'Doesn\'t match with the image'},
        {id: 0, label: 'Other'}
      ],
      reportUserReasons: [
        {id: 4, label: 'Suspicious behaviour'},
        {id: 3, label: 'Scam'},
        {id: 6, label: 'No-show'},
        {id: 5, label: 'Bad behaviour'},
        {id: 7, label: 'Defective or wrong item'},
        {id: 0, label: 'Other concern'},
      ],
      archiveConversationSuccess: 'The conversation has been archived correctly',
      reportListingSuccess: 'The listing has been reported correctly',
      reportUserSuccess: 'The user has been reported correctly',
      newMessageNotification: 'New message from ',
      date_desc: 'Date: from recent to old',
      date_asc: 'Date: from old to recent',
      price_desc: 'Price: from high to low',
      price_asc: 'Price:  from low to high',
      bulkDeleteError: 'Some listings have not been deleted due to an error',
      bulkReserveError: 'Some listings have not been reserved due to an error',
      bulkSoldError: 'Some listings have not been set as sold due to an error',
      phonesShared: 'Shared phones',
      phoneCalls: 'Phone calls',
      phones: 'Phones',
      meetings: 'Meetings',
      messages: 'Messages',
      shared: 'Shared Phone',
      missed: 'Missed Call',
      answered: 'Received Call',
      chats: 'Chats',
      sold: 'Sold',
      views: 'Views',
      ExtensionNotAllowed: 'This file has not a valid image format: ',
      MaxUploadsExceeded: 'This file exceed the limit of 8 photos: ',
      serverError: 'Server error: ',
      productCreated: 'The product has been created successfully!',
      missingImageError: 'You should upload at least one image',
      errorPurchasingItems: 'It was not possible to feature these products: '
    },
    es: {
      daysMomentConfig: {
        lastDay: '[Ayer]',
        sameDay: 'HH:mm',
        nextDay: '[Mañana]',
        lastWeek: 'dddd',
        nextWeek: 'dddd',
        sameElse: 'D [de] MMMM'
      },
      reportListingReasons: [
        {id: 1, label: 'Categoría equivocada'},
        {id: 2, label: 'Personas o animales'},
        {id: 3, label: 'Broma'},
        {id: 4, label: 'Producto falso'},
        {id: 5, label: 'Contenido explícito'},
        {id: 7, label: 'Comida'},
        {id: 8, label: 'Drogas o medicinas'},
        {id: 6, label: 'No concuerda con la imagen'},
        {id: 0, label: 'Otros'}
      ],
      reportUserReasons: [
        {id: 4, label: 'Sospecha de fraude'},
        {id: 3, label: 'Fraude'},
        {id: 6, label: 'No asistencia a la cita'},
        {id: 5, label: 'Mal comportamiento o abuso'},
        {id: 7, label: 'Artículo defectuoso o incorrecto'},
        {id: 0, label: 'Otras causas'},
      ],
      archiveConversationSuccess: 'La conversación se ha archivado correctamente',
      reportListingSuccess: 'La publicación se ha denunciado correctamente',
      reportUserSuccess: 'El usuario se ha denunciado correctamente',
      newMessageNotification: 'Nuevo mensaje de ',
      date_desc: 'Fecha: descendente',
      date_asc: 'Fecha: ascendente',
      price_desc: 'Precio: descendente',
      price_asc: 'Precio: ascendente',
      bulkDeleteError: 'Algunos productos no se han eliminado debido a un error',
      bulkReserveError: 'Algunos productos no se han reservado debido a un error',
      bulkSoldError: 'Algunos productos no se han marcado como vendido debido a un error',
      phonesShared: 'Teléfonos compartidos',
      phoneCalls: 'Llamadas',
      phones: 'Teléfonos',
      meetings: 'Citas',
      messages: 'Mensajes',
      shared: 'Teléfono compartido',
      missed: 'Llamada perdida',
      answered: 'Llamada recibida',
      chats: 'Chats',
      sold: 'Vendido',
      views: 'Visualizaciones',
      ExtensionNotAllowed: 'Este fichero no tiene un formato de imagen correcto: ',
      MaxUploadsExceeded: 'Este fichero excede el limite de 8 fotos: ',
      serverError: 'Error del servidor: ',
      productCreated: 'El producto se ha creado correctamente!',
      missingImageError: 'Tienes que subir por lo menos una imagen',
      errorPurchasingItems: 'No se han podido destacar estos productos:'
    }
  };

  constructor(@Inject(LOCALE_ID) private _locale: string) {
  }

  get locale() {
    return this._locale === 'en-US' ? 'en' : this._locale;
  }

  getTranslations(key: string) {
    return this.translations[this.locale][key];
  }

}

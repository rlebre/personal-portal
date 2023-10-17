import ModalEvent from './ModalEvent';

type CallbackFn = (event: CustomEvent) => void;

export class ModalService {
  static on(event: string, callback: CallbackFn) {
    document.addEventListener<any>(event, callback);
  }

  static off(event: string, callback: CallbackFn) {
    document.removeEventListener<any>(event, callback);
  }

  static success(data: ModalEvent) {
    document.dispatchEvent(new CustomEvent('success', { detail: data }));
  }

  static error(data: ModalEvent) {
    document.dispatchEvent(new CustomEvent('error', { detail: data }));
  }

  static openGalleryPeek(data: ModalEvent) {
    document.dispatchEvent(new CustomEvent('openGalleryPeek', { detail: data }));
  }
}

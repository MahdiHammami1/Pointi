import Swal, { SweetAlertIcon } from 'sweetalert2';

export function showConfirmDialog(options: {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
} = {}): Promise<boolean> {
  return Swal.fire({
    title: options.title || 'Êtes-vous sûr ?',
    text: options.text || '',
    icon: options.icon || 'question',
    showCancelButton: true,
    confirmButtonColor: '#2a5298',
    cancelButtonColor: '#d33',
    confirmButtonText: options.confirmButtonText || 'Oui',
    cancelButtonText: options.cancelButtonText || 'Annuler',
    customClass: {
      popup: 'swal2-popup-custom',
      confirmButton: 'swal2-confirm-custom',
      cancelButton: 'swal2-cancel-custom',
    }
  }).then(result => result.isConfirmed);
}

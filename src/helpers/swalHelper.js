import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showClass: {
    popup: 'animate__animated animate__fadeInRight'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutRight'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showSuccess = (message) => {
  Swal.fire({
    icon: 'success',
    title: '<span style="color: #27ae60">Success!</span>',
    text: message,
    confirmButtonColor: '#EE2529',
    confirmButtonText: 'Great!',
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

export const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: '<span style="color: #e74c3c">Oops...</span>',
    text: message,
    confirmButtonColor: '#EE2529',
    showClass: {
        popup: 'animate__animated animate__shakeX'
    }
  });
};

export const showWarning = (message) => {
  Swal.fire({
    icon: 'warning',
    title: '<span style="color: #f39c12">Note</span>',
    text: message,
    confirmButtonColor: '#EE2529',
    showClass: {
        popup: 'animate__animated animate__pulse'
    }
  });
};

export const showToast = (icon, message) => {
  Toast.fire({
    icon: icon,
    title: message
  });
};

export const confirmAction = async (title, text, confirmText = 'Yes, do it!', cancelText = 'Cancel') => {
  const result = await Swal.fire({
    title: `<span style="color: #34495e">${title}</span>`,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EE2529',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__headShake'
    }
  });
  return result.isConfirmed;
};

export default Swal;


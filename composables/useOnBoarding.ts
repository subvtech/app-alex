import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Shepherd from 'shepherd.js';

export function useOnBoarding(steps) {
  const { t } = useI18n();
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      arrow: true,
      classes: 'shepherd-step',
      scrollTo: true,
      highlightClass: 'active-step',
    },
  });

  steps.forEach((step) => {
    tour.addStep({
      ...step,
      title: t(step.title),
      text: t(step.text),
      buttons: step.buttons.map((button) => ({
        ...button,
        text: t(button.text),
        action:
          button.action === 'next'
            ? tour.next
            : button.action === 'back'
            ? tour.back
            : button.action === 'cancel'
            ? tour.cancel
            : button.action === 'complete'
            ? tour.complete
            : null,
      })),
    });
  });

  onMounted(() => {
    tour.start();
  });

  return {
    tour,
  };
}

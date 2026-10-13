export function useIncidentReport() {
  const isReportModalOpen = useState<boolean>('report_incident_modal_open', () => false)
  const reportTriggerSelector = useState<HTMLElement | SVGElement | string | null>('report_incident_trigger_selector', () => null)

  const openReportModal = (trigger?: HTMLElement | SVGElement | string | null) => {
    if (trigger) {
      reportTriggerSelector.value = trigger
    }
    isReportModalOpen.value = true
  }

  const closeReportModal = () => {
    isReportModalOpen.value = false
  }

  return {
    isReportModalOpen,
    reportTriggerSelector,
    openReportModal,
    closeReportModal
  }
}

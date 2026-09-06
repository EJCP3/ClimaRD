export function useIncidentReport() {
  const isReportModalOpen = useState<boolean>('report_incident_modal_open', () => false)
  const reportTriggerSelector = useState<any>('report_incident_trigger_selector', () => null)

  const openReportModal = (trigger?: any) => {
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

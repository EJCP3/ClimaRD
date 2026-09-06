export function useIncidentReport() {
  const isReportModalOpen = useState<boolean>('report_incident_modal_open', () => false)
  const reportTriggerSelector = useState<string | null>('report_incident_trigger_selector', () => null)

  const openReportModal = (triggerSelector?: string) => {
    if (triggerSelector) {
      reportTriggerSelector.value = triggerSelector
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

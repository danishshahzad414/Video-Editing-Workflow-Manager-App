import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import PreUploadChecklist from '../../components/counselor/PreUploadChecklist'
import VideoUploadModal from '../../components/counselor/VideoUploadModal'

export default function Upload() {
  const [showChecklist, setShowChecklist] = useState(true)
  const [showUpload, setShowUpload] = useState(false)

  return (
    <Layout title="Upload Video">
      <div className="max-w-2xl mx-auto fade-in">
        {showChecklist && !showUpload && (
          <PreUploadChecklist
            onProceed={() => { setShowChecklist(false); setShowUpload(true) }}
            onClose={() => setShowChecklist(true)}
          />
        )}
        {showUpload && (
          <VideoUploadModal onClose={() => { setShowUpload(false); setShowChecklist(true) }} />
        )}
      </div>
    </Layout>
  )
}

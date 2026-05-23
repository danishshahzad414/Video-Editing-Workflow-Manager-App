import Layout from '../../components/layout/Layout'
import VideoUploadModal from '../../components/counselor/VideoUploadModal'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const navigate = useNavigate()

  return (
    <Layout title="Upload Video">
      <div className="max-w-2xl mx-auto fade-in">
        <VideoUploadModal onClose={() => navigate('/counselor/dashboard')} />
      </div>
    </Layout>
  )
}

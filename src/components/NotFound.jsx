import config from '../config'
export default function NotFound() {
  return (
    <div className="error-screen">

      <div className='error-container'>
        <div className="logo-container"><img src={config.imgUrl} alt="" className='logo' /></div>
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Doğrulama Hatası</h2>
        <p className="error-message">Kullanıcı Doğrulanamadı!</p>
      </div>
    </div>

  )

}

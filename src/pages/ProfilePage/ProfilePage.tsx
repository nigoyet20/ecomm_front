
import { Outlet } from 'react-router-dom';
import './ProfilePage.scss'

function ProfilePage() {

  return (
    <div className="profile">
      <Outlet />
    </div>
  )
}

export default ProfilePage;

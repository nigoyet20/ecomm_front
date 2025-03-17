import './LoadingPage.scss'
import SpinnerSquare from '../../components/App/SpinnerSquare/SpinnerSquare';

function LoadingPage() {

  return (
    <div className="loadingPage">
      <SpinnerSquare isOpen={true} />
    </div >
  )
}

export default LoadingPage;

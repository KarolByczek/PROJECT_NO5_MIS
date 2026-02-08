import { Link } from 'react-router';
import './HeadStrip.scss';

const HeadStrip = () => {
  return (
    <Link to="/">
      <div className='headstrip'>
        <p>
          GALERIA <span className='header_name'>FLORIANA MUSIAŁA</span>
        </p>
      </div>
    </Link>
  )
}

export default HeadStrip

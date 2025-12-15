import { Link } from 'react-router';
import './HeadStrip.scss';

const HeadStrip = () => {
  return (
    <Link to="/">
      <div className='headstrip'>
        <p>
          GALERIA <span className='header_name'>FLORIAN MUSIAŁ</span> <span className='header_city'>-LUBLIN</span>
        </p>
      </div>
    </Link>
  )
}

export default HeadStrip

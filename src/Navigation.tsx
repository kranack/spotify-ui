import { Link, useNavigate } from 'react-router-dom'

export default function Navigation() {
  const navigate = useNavigate()
  
  let navbarElement : HTMLDivElement|null = null
  let navbarBurgerElement : HTMLAnchorElement | null = null

  const onClickBurgerHandler = () => {
    if (!navbarElement || !navbarBurgerElement) return;
    
    navbarBurgerElement.classList.toggle('is-active')
    navbarElement.classList.toggle('is-active')
  }

  return (
    <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="#" onClick={() => navigate(-1)}>
          <span className="icon is-small">
            <i className="fas fa-chevron-left" aria-hidden="true"></i>
          </span>
          <span>Back</span>
        </a>
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={onClickBurgerHandler} ref={node => navbarBurgerElement = node }>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className="navbar-menu" ref={node => navbarElement = node}>
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/user" className="navbar-item">User</Link>
        </div>
      </div>
    </nav>
  )
}

/*

<nav className="breadcrumb" aria-label="breadcrumbs">
      
      <ul>
        <li>
          <Link to="/">
            <span className="icon is-small">
              <i className="fas fa-home" aria-hidden="true"></i>
            </span>
            <span>Home</span>
          </Link>
        </li>
        <li className="is-active">
          <a href="#">
            <span className="icon is-small">
              <i className="fas fa-thumbs-up" aria-hidden="true"></i>
            </span>
            <span>Playlist</span>
          </a>
        </li>
      </ul>
    </nav>
    */
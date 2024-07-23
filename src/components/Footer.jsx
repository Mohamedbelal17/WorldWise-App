function Footer({ fstyle, pstyle }) {
  return (
    <footer className={fstyle}>
      <p className={pstyle}>
        &copy; Copyright {new Date().getFullYear()} by WorldWise iIc.
      </p>
    </footer>
  );
}

export default Footer;

function IconAddOutline(props) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1.75em"
      width="1.75em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M256 112v288M400 256H112"
      />
    </svg>
  );
}

export default IconAddOutline;

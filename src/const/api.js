export default function api(link) {
  return `${process.env.REACT_APP_BACKEND_HOST}/${link}`;
}

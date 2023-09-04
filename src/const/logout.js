export default function logout() {
  sessionStorage.removeItem("user");
  window.location.replace("/");
}

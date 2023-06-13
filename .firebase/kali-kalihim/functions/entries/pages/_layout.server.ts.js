const load = async ({ locals }) => {
  if (!locals.userData) {
    return;
  }
  return {
    user: locals.userData
  };
};
export {
  load
};

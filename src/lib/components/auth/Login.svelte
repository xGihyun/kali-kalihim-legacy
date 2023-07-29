<div class="flex h-full w-full items-center">
  <div class="flex h-full w-full flex-col items-center justify-center">
    <h1
      class="mb-10 select-none text-center font-gt-walsheim-pro-medium text-5xl uppercase md:text-7xl 2xl:text-9xl"
    >
      Kali Kalihim
    </h1>
    <div class="flex flex-col gap-4">
      <form class="contents" method="post" action="?/login">
        <div>
          <label class="label text-lg">
            <span>Email</span>
            <input class="input variant-form-material" type="email" name="email" required />
          </label>

          <label class="label text-lg">
            <span>Password</span>
            <input
              class="input variant-form-material"
              type="password"
              name="password"
              required
            />
          </label>
        </div>
        <button class="btn variant-filled-primary mx-auto flex">
          <span class="text-lg">Submit</span>
        </button>
      </form>
    </div>
  </div>
</div>

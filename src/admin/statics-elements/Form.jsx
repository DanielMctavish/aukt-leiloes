import React from "react";

function Form({ formData, handleChange, handleSubmit }) {
  return (
    <form className="max-w-full mt-8 lg:pl-20 pl-4" onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-2 g grid-cols-1 gap-12">
        <div>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Primeiro Nome
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full border border-solid lg:border-gray-300 border-[#012038] p-2 bg-transparent lg:rounded-none rounded-[30px]"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Segundo Nome
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full border border-solid lg:border-gray-300 border-[#012038] p-2 bg-transparent lg:rounded-none rounded-[30px]"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-solid lg:border-gray-300 border-[#012038] p-2 bg-transparent lg:rounded-none rounded-[30px]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 lg:hidden inline">
            <label
              htmlFor="phoneNumber"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Número de Telefone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="w-full border border-solid lg:border-gray-300 border-[#012038] p-2 bg-transparent lg:rounded-none rounded-[30px]"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 lg:inline hidden">
            <label
              htmlFor="phoneNumber"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Número de Telefone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="w-full border border-solid lg:border-gray-300 border-[#012038] p-2 bg-transparent lg:rounded-none rounded-[30px]"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 lg:inline hidden">
            <label
              htmlFor="state"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Estado
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="w-full border border-solid border-gray-300 p-2 bg-transparent"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
  
          <div className="mb-4 lg:inline hidden">
            <label
              htmlFor="city"
              className="text-zinc-400 text-[12px] font-medium"
            >
              Cidade
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="w-full border border-solid border-gray-300 p-2 bg-transparent"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default Form;

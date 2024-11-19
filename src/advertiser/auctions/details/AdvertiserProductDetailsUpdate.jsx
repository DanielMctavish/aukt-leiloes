/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button } from "@mui/material";

const AdvertiserProductDetailsUpdate = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        const localAdvertiser = JSON.parse(currentLocalAdvertiser)

        // Create an object with only the modified fields
        const updatedFields = {};
        for (const key in formData) {
            if (formData[key] !== product[key]) {
                updatedFields[key] = formData[key];
            }
        }

        // Add advertiser_id to the updated fields if necessary
        if (product.advertiser_id) {
            updatedFields.advertiser_id = product.advertiser_id;
        }

        // Convert numeric fields to numbers
        if (updatedFields.initial_value) updatedFields.initial_value = parseFloat(updatedFields.initial_value);
        if (updatedFields.reserve_value) updatedFields.reserve_value = parseFloat(updatedFields.reserve_value);
        if (updatedFields.height) updatedFields.height = parseFloat(updatedFields.height);
        if (updatedFields.width) updatedFields.width = parseFloat(updatedFields.width);
        if (updatedFields.weight) updatedFields.weight = parseFloat(updatedFields.weight);

        try {
            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/products/update-product`, updatedFields, {
                headers: {
                    'Authorization': `Bearer ${localAdvertiser.token}`
                },
                params: {
                    product_id: product.id
                }
            });
            onUpdate();
            onClose();
        } catch (error) {
            return error
        }
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[90%] md:w-[50%] bg-[#1c2b3a] p-4 rounded-lg shadow-lg">
                <h2 className="text-zinc-200 text-center mb-4">Editar Produto</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Título"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{
                            style:
                                { color: '#fff', fontSize: "22px" }
                        }}
                    />
                    <TextField
                        label="Descrição"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        label="Valor Inicial"
                        name="initial_value"
                        value={formData.initial_value}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="number"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        label="Valor de Reserva"
                        name="reserve_value"
                        value={formData.reserve_value}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="number"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        label="Categoria"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        label="Grupo"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <div className="flex justify-end gap-4">
                        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#1f70ae', '&:hover': { backgroundColor: '#155a8a' } }}>Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#1f70ae', '&:hover': { backgroundColor: '#155a8a' } }}>Salvar</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default AdvertiserProductDetailsUpdate;
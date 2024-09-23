const db = require('../config/db.config.js');
const DetalleFactura = db.DetalleFactura;
const Reserva = db.Reserva;       // Asumiendo que has importado el modelo Reserva
const Factura = db.Factura;       // Asumiendo que has importado el modelo Factura
const TipoMenu = db.TipoMenu;     // Asumiendo que has importado el modelo TipoMenu

exports.create = async (req, res) => {
    let detalleFactura = {};
    try {
        console.log('Received request body:', req.body);

        detalleFactura.noFactura = req.body.noFactura;
        detalleFactura.serieFactura = req.body.serieFactura;
        detalleFactura.idAlimento = req.body.idAlimento;
        detalleFactura.noReserva = req.body.noReserva;
        detalleFactura.costo = req.body.costo;
        detalleFactura.fechaCompra = req.body.fechaCompra;
        detalleFactura.lugarCompra = req.body.lugarCompra;

        // Check if related factura exists
        const factura = await Factura.findByPk(detalleFactura.noFactura);
        if (!factura) {
            return res.status(404).json({
                message: "Factura with noFactura = " + detalleFactura.noFactura + " not found!",
                error: "404"
            });
        }

        // Check if related reserva exists
        if (detalleFactura.noReserva) {
            const reserva = await Reserva.findByPk(detalleFactura.noReserva);
            if (!reserva) {
                return res.status(404).json({
                    message: "Reserva with noReserva = " + detalleFactura.noReserva + " not found!",
                    error: "404"
                });
            }
        }

        // Check if related alimento exists
        if (detalleFactura.idAlimento) {
            const alimento = await TipoMenu.findByPk(detalleFactura.idAlimento);
            if (!alimento) {
                return res.status(404).json({
                    message: "Alimento with idAlimento = " + detalleFactura.idAlimento + " not found!",
                    error: "404"
                });
            }
        }

        const result = await DetalleFactura.create(detalleFactura);

        res.status(200).json({
            message: "DetalleFactura created successfully with idDetalle = " + result.idDetalle,
            detalleFactura: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create DetalleFactura!",
            error: error.message
        });
    }
}

exports.retrieveAllDetalles = async (req, res) => {
    try {
        const detalleFacturaInfos = await DetalleFactura.findAll();
        res.status(200).json({
            message: "Successfully retrieved all DetalleFacturas' Infos!",
            detalleFacturas: detalleFacturaInfos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving DetalleFacturas!",
            error: error.message
        });
    }
}

exports.getDetalleById = async (req, res) => {
    try {
        const idDetalle = req.params.id;
        const detalleFactura = await DetalleFactura.findByPk(idDetalle);
        
        if (!detalleFactura) {
            return res.status(404).json({
                message: "DetalleFactura with idDetalle = " + idDetalle + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved DetalleFactura with idDetalle = " + idDetalle,
            detalleFactura: detalleFactura
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving DetalleFactura with idDetalle = " + req.params.id,
            error: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const idDetalle = req.params.id;
        const detalleFactura = await DetalleFactura.findByPk(idDetalle);

        if (!detalleFactura) {
            return res.status(404).json({
                message: "DetalleFactura with idDetalle = " + idDetalle + " not found for update!",
                error: "404"
            });
        }

        const updatedObject = {
            noFactura: req.body.noFactura,
            serieFactura: req.body.serieFactura,
            idAlimento: req.body.idAlimento,
            noReserva: req.body.noReserva,
            costo: req.body.costo,
            fechaCompra: req.body.fechaCompra,
            lugarCompra: req.body.lugarCompra
        };

        const updated = await DetalleFactura.update(updatedObject, {
            where: { idDetalle: idDetalle }
        });

        if (updated[0] === 0) {
            return res.status(500).json({
                message: "Failed to update DetalleFactura with idDetalle = " + idDetalle,
                error: "Update failed"
            });
        }

        const updatedDetalle = await DetalleFactura.findByPk(idDetalle);

        res.status(200).json({
            message: "DetalleFactura updated successfully with idDetalle = " + idDetalle,
            detalleFactura: updatedDetalle
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating DetalleFactura with idDetalle = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const idDetalle = req.params.id;
        const detalleFactura = await DetalleFactura.findByPk(idDetalle);

        if (!detalleFactura) {
            return res.status(404).json({
                message: "DetalleFactura with idDetalle = " + idDetalle + " does not exist!",
                error: "404"
            });
        }

        await detalleFactura.destroy();
        res.status(200).json({
            message: "DetalleFactura deleted successfully with idDetalle = " + idDetalle,
            detalleFactura: detalleFactura
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting DetalleFactura with idDetalle = " + req.params.id,
            error: error.message
        });
    }
}

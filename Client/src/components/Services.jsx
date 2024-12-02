import React, { useState } from "react";
import { Button, Drawer, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import WorkshopIcon from "../assets/Images/Workshop.svg";
import useServicesStore from "../store/ServicesStore";

const { Text } = Typography;

const Services = ({ locatService, selecteService }) => {
    const services = useServicesStore((state) => state.services);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleLocateService = (username, lng, lat, role, id, phone) => {
        locatService(lng, lat, role, id, username, (phone || "01001055935"));
        selecteService({ username, role, phone: (phone || "01001055935") });
        setDrawerVisible(false);
    };

    return (
        <>
            {/* Button to open Services Sidebar */}
            <button
                onClick={() => setDrawerVisible(true)}
                className={`fixed bottom-5 right-5 bg-[#4840A3] text-white p-2 rounded-full shadow-lg hover:bg-[#EAB95C] transition-all flex justify-center items-center h-12 !aspect-square}`}
            >
                <img
                    src={WorkshopIcon}
                    className="!w-full !h-full"
                    alt="Workshop Icon"
                />
            </button>

            {/* Drawer for Services List */}
            <Drawer
                title="Nearby Services"
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                width={400}
            >
                <div className="services-list grid gap-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="service-item p-4 border rounded shadow-sm hover:shadow-md transition"
                        >
                            <Text strong>{service.username}</Text>
                            <p>Role: {service.role}</p>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={() =>
                                        handleLocateService(
                                            service.username,
                                            service.location.lng,
                                            service.location.lat,
                                            service.role,
                                            service.id,
                                            service.phone
                                        )
                                    }
                                    type="primary"
                                    className="w-full font-bold"
                                >
                                    Locate
                                </Button>
                                <Button
                                    type="default"
                                    disabled
                                    className="w-full font-bold"
                                    onClick={() => handleServiceClick(service)}
                                >
                                    Request
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </>
    );
};

export default Services;

"use client"
import { Button, Input, InputNumber, Modal,  Col, Row, Divider, Typography, Space} from 'antd';
import { useState } from 'react'; 
import { Item } from "@/app/components/ListItems";


interface ModalEditItem {
    selectedItem: Item,
    visible: boolean,
    onCloseModal: () => void,
    onSaveEdit: (itemEdit: Item) => void,
}

export const ModalEdit = ({selectedItem, onCloseModal, visible, onSaveEdit}:ModalEditItem) =>{
    const { Text } = Typography;
    const [itemEdit, setItemEdit] = useState(selectedItem)
    const [isEdited, setIsEdited] = useState(false);

    const handleCloseModal = () => {
        onCloseModal()
    };

    const handleSavEdit = () => {
        onSaveEdit(itemEdit)
        onCloseModal()
    };

    const handleInputChange = (field: string, value: string | number) => {
        setItemEdit({ ...itemEdit, [field]: value });
        setIsEdited(true); 
    };
    
    return(
        <Modal
        key={itemEdit?.id}
        open={visible}
        title={"Item código: "+ itemEdit.code}
        onCancel={handleCloseModal}
        centered
        footer={[
            <Button key="back" onClick={handleCloseModal}>
               Fechar
            </Button>,
            <Button key="save" onClick={handleSavEdit}  disabled={!isEdited}>
                Ok
            </Button>,
        ]} 
        >
    <Row>
        <Col span={24}>
            <Text strong>Descrição</Text>
            <Input title='Descrição' placeholder="Descrição" key="descriptionModal" value={itemEdit?.description} onChange={(e) => handleInputChange('description', e.target.value)} />
        </Col>
        <br/>
        <br/>
        <br/>
        <Col span={12}>
            <Text strong>Quantidade</Text>
            <InputNumber  style={{ width: '15em' }} title='Quantidade' placeholder="Quantidade"  key="quantityModal" value={itemEdit?.quantity}  onChange={(value) => handleInputChange('quantity', Number(value))}/>
        </Col>
        <Col span={12}>   
            <Text strong>Preço</Text>
            <InputNumber
                style={{ width: '15em' }}
                decimalSeparator=","
                prefix="R$"
                value={itemEdit?.price}
                onChange={(value) => handleInputChange('price', Number(value))}
            />
      </Col>
    </Row>
    <Divider />
    </Modal>
    )
}

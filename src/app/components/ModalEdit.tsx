"use client"
import { Button, Input, Modal} from 'antd';
import { useState } from 'react'; 
import { Item } from "@/app/components/ListItems";


interface ModalEditItem {
    selectedItem: Item,
    onCloseModal: () => void,
    visible: boolean,
    onSaveEdit: (itemEdit: Item) => void,
}

export const ModalEdit = ({selectedItem, onCloseModal, visible, onSaveEdit}:ModalEditItem) =>{
    const [itemEdit, setItemEdit] = useState(selectedItem)


    const handleCloseModal = () => {
        onCloseModal()
    };

    const handleSavEdit = () => {
        onSaveEdit(itemEdit)
        onCloseModal()
    };
 
    return(
        <Modal
        key={itemEdit?.id}
        open={visible}
        title={"Detalhes Item código: "+itemEdit.code}
        onCancel={handleCloseModal}
        footer={[
            <Button key="back" onClick={handleCloseModal}>
               Fechar
            </Button>,
            <Button key="save" onClick={handleSavEdit}>
                Ok
            </Button>,
        ]} 
        >
            <Input  title='Descrição' placeholder="Descrição" key="descriptionModal" value={itemEdit?.description} onChange={(e) => setItemEdit({...itemEdit, description: e.target.value})} />
            <Input  title='Quantidade' placeholder="Quantidade"  key="quantityModal" value={itemEdit?.quantity} onChange={(e) => setItemEdit({...itemEdit, quantity: Number(e.target.value)})}/>
            <Input  title='Preço' placeholder="Preço" key="priceModal" value={itemEdit?.price} onChange={(e) => setItemEdit({...itemEdit, price: Number(e.target.value)})} />
    </Modal>
    )
}

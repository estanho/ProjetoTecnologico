import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from '@nextui-org/react';

export default function Confirmation({
  isOpen,
  onOpenChange,
  onConfirm,
  action,
}: any) {
  const handleConfirm = () => {
    onConfirm(action);
    onOpenChange();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
      }}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Você tem certeza?</ModalHeader>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Não
              </Button>
              <Button color="success" variant="flat" onPress={handleConfirm}>
                Sim
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

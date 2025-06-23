import EditButton from "../../buttons/EditButton";
import SaveButton from "../../buttons/SaveButton";
import FavoritesList from "../favorites/FavoritesList";
import UserOrders from "../orders/UserOrders";
import SavedAddresses from "../saved-address/SaveAddresses";
import { ProfileFields } from "./ProfileFields";

export default function ProfileDetails({
    activeTab,
    editMode,
    values,
    changeHandler,
    submitHandler,
    pending,
    handleCancel,
    handleEdit
}) {
    return (
        <main className="flex-1 xl:mt-18 md:mt-20 pt-12 px-4 max-w-full overflow-x-hidden">
            {activeTab === "details" && (
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 max-w-md w-full mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Детайли на профила
                    </h3>
                    <form onSubmit={editMode ? submitHandler : undefined}>
                        <ProfileFields
                            values={values}
                            changeHandler={changeHandler}
                            editMode={editMode}
                        />
                        <div className="mt-6">
                            {editMode ? (
                                <SaveButton pending={pending} onCancel={handleCancel} />
                            ) : (
                                <EditButton onEdit={handleEdit} />
                            )}
                        </div>
                    </form>
                </div>
            )}
            {activeTab === "orders" && <UserOrders />}
            {activeTab === "addresses" && <SavedAddresses />}
            {activeTab === "favorites" && <FavoritesList />}
        </main>
    );
}
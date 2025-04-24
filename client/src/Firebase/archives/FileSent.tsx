import { useNavigate } from "react-router-dom";
import { userSentByCurrentUser } from "../hoocks/UserFilsSentByCurrentUser";

function FileSent() {
  const { files } = userSentByCurrentUser();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-lg font-semibold mb-4">
          {files.length === 0 ? (
            <div className="text-gray-500">Aucun fichier envoyé</div>
          ) : (
            files.map((doc, key) => {
              return (
                <div
                  key={key}
                  onClick={() => navigate(`/files/${doc.id}`)}
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded p-3 mb-2 transition"
                >
                  {doc.originaleFilename}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default FileSent;

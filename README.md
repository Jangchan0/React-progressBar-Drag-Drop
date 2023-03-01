# DropFileInput 컴포넌트에서 모든 로직이 이루어집니다.

## 설명

fileList State는 기존에 localStorage에 fileList 키값으로 저장되어있는 값들을 불러옵니다. 파일이 없는경우, 빈 배열로 시작하게 됩니다.

이 컴포넌트에선 크게 3가지 로직으로 구성되어 진행됩니다.

### selcetFiles 함수

먼저 첫번째, selectFiles는 유저가 직접 파일 선택창에서 파일을 선택하고 '확인' 버튼을 눌렀을 때 실행되는 로직입니다.
selectFiles는 선택된 파일들을 기존에 filesList의 정보에 이어붙이게 만들었습니다. 그리고 newFileList라는 배열에 선택된 파일들을 담습니다.

### DragDrop 함수

두번째로, DragDrop 로직입니다. 유저가 파일선택창에서 input범위에 파일을 끌어다 놓았을 때, 파일을 추가하는 함수로 만들어져있습니다. 이 함수도 마찬가지로 선택되어 끌어다진 파일들을 fileList에 추가하고, newFileList 배열에도 추가합니다.

파일이 선택, 끌어다지면 fileList가 map을 통해 <div className ="drop-file-preview__item"> 로 나열되게 됩니다.

### 추가 구현 중

현재 두 로직에 쓰인 파일들을 로컬스토리지에 저장하려는 로직이 미완성 상태입니다.

### ProgressBar 구현

마지막으로 ProgressBar입니다. 현재 업로드의 진행상태를 알 수 있도록 만들어진 ProgressBar는 axios의 명령어인 'onUploadProgress'를 사용하였습니다. 추가된 파일은 154번째 줄, onChange함수의 e 로 인식되어 onUploadProgress의 파라미터로 사용됩니다. 이벤트로 들어온 파일들은 데이터 총량(e.total), 전송된 데이터량(e.loaded)로 수치화할 수 있고, 이후 innerHTML로 동적인 변수로 활용할 수 있습니다. 얼마나 진행되었는지, 업로드 진행현황을 유저가 한눈에 알아볼 수 있게 된 것입니다. 이후 통신에 성공하면 response로 들어오는 메세지를 alert으로 '몇개의 파일을 업로드하였습니다.' 라는 알림을 띄울 수 있습니다. progressBar의 진행을 나타내는 progressBar width 값도, ProgressPercent State로 수치화하여 동적으로 관리하고 있습니다.

" Before using this configuration follow the instruction below
"
" Check the requirements for plugins:
"  * CMake required for Valloric/YouCompleteMe
"  * npm   required for marijnh/tern_for_vim
"
" Create folders for storing temporary files
" $ mkdir ~/.vim/backup && mkdir ~/.vim/tmp
" 
" Download Vim-Plug:
" $ curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
"     https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
" 
" Download Solarized colorscheme
" $ curl -fLo ~/.vim/colors/solarized.vim --create-dirs \
"     https://raw.githubusercontent.com/altercation/vim-colors-solarized/master/colors/solarized.vim
"
" Install Vim plugins with the command:
" :PlugInstall

call plug#begin('~/.vim/plugged')

Plug 'junegunn/vim-easy-align' " Aligning bunch of lines
Plug 'SirVer/ultisnips' | Plug 'honza/vim-snippets' " Generating code with snippets

Plug 'Valloric/YouCompleteMe', { 'dir': '~/.vim/plugged/YouCompleteMe', 'do': '/bin/bash install.sh' } | Plug 'marijnh/tern_for_vim', { 'dir': '~/.vim/plugged/tern_for_vim', 'do': 'npm install' } " Super autocomplete (works only with CMake)
Plug 'junegunn/vim-github-dashboard' " See activity on GH
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': 'yes \| ./install' } " Searching objects in FS
Plug 'jelera/vim-javascript-syntax' | Plug 'pangloss/vim-javascript' | Plug 'nathanaelkane/vim-indent-guides' " Javascript syntax
Plug 'scrooloose/syntastic' " Check syntax with linters (for example: npm i -g jshint)
Plug 'ekalinin/Dockerfile.vim' " Syntax for Dockerfile
Plug 'itchyny/lightline.vim' " Sexy status bar
Plug 'tpope/vim-fugitive' " Working with Git

call plug#end()

" Hack to fix reloading .vimrc
augroup reload_vimrc " {
  autocmd!
  autocmd BufWritePost $MYVIMRC nested source $MYVIMRC
augroup END " }

" Enable using local .vimrc files
set exrc
set secure " disable using dangerous commands in local .vimrc files

" Custom directories
set backupdir=~/.vim/backup
set directory=~/.vim/tmp

" Better navigation
map <C-h> <C-w>h
map <C-j> <C-w>j
map <C-k> <C-w>k
map <C-l> <C-w>l
setlocal foldmethod=indent

" Enable pretty colorscheme
syntax enable
syntax on
set background=dark
colorscheme solarized

" Show line numbers
set number
set relativenumber

" Padding settings
set tabstop=2
set shiftwidth=2
set softtabstop=2
set smarttab
set expandtab
set smartindent
set autoindent
set pastetoggle=<f5> " to stop indenting when pasting from GUI
set linebreak
let showbreak='+++ '

" Search settings
set incsearch
set hlsearch

" Screen follows cursor
set scrolloff=12

" Expand history
set history=200

" Setup Lightline (itchyny/lightline.vim)
set laststatus=2
set noshowmode
let g:lightline = {
      \ 'colorscheme': 'solarized',
      \ 'active': {
      \   'left': [ [ 'mode', 'paste' ],
      \             [ 'fugitive', 'readonly', 'filename', 'modified' ] ]
      \ },
      \ 'component': {
      \   'readonly': '%{&filetype=="help"?"":&readonly?"☓":""}',
      \   'modified': '%{&filetype=="help"?"":&modified?"∗":&modifiable?"":"ø"}',
      \   'fugitive': '%{exists("*fugitive#head")?fugitive#head():""}'
      \ },
      \ 'component_visible_condition': {
      \   'readonly': '(&filetype!="help"&& &readonly)',
      \   'modified': '(&filetype!="help"&&(&modified||!&modifiable))',
      \   'fugitive': '(exists("*fugitive#head") && ""!=fugitive#head())'
      \ }
      \ }
if !has('gui_running')
  set t_Co=256
endif

" Setup Syntatic (scrooloose/syntastic)
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0

" Settings for YouCompleteMe (Valloric/YouCompleteMe)
set completeopt-=preview
let g:ycm_key_list_select_completion = ['<C-n>', '<Down>']
let g:ycm_key_list_previous_completion = ['<C-N>', '<Up>']
let g:SuperTabDefaultCompletionType = '<C-n>'


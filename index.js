/*****

Template básico de aplicativo Node.JS com o módulo 'express'.
Autor: @bwb0de
email: danielc@unb.br

*****/

//Importando módulos do a serem usados
var express = require('express'); //http framework
var handlebars = require('express-handlebars').create({defaultLayout:'main'}); //Definindo os padrões dos templates (handlebars)
var body_parser = require('body-parser'); //Módulo necessário para obter dados encaminhados por formulários mediante POST.
var fs = require("fs");

var app = express();

app.disable('x-powered-by'); //Evitando que informações do servidor sejam exibidas no cabeçalho das páginas do aplicativo.
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(body_parser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000); //Definindo a porta do servidor http
app.use(express.static(__dirname+"/public")); //Conteúdo estático estará acessível pela pasta 'public', na raiz do aplicativo.

var formularios;
var fast_data;


fs.readdir("./nfo/forms", function(err, folder_f_list) {
  output = {};
  for (var i in folder_f_list) {
    atrib = folder_f_list[i].split('.')[0];
    eval("output."+atrib+" = read_json_file('./nfo/forms/'+folder_f_list[i])");
  }
  formularios = output;
});



fs.readFile('./nfo/pacientes.json', function(err, rawdata) {
  output = [];
  db_data = JSON.parse(rawdata);
  for (var i in db_data) {
    fast_ob = {
      id: db_data[i].identificador,
      nome: db_data[i].dados.nome,
      telefone: db_data[i].dados.telefone,
      email: db_data[i].dados.email
    };
    output.push(fast_ob);
  }
  fast_data = output;
});



function data_format() {
  t = Date().split(' ');
  t = t[2]+'/'+t[1]+'/'+t[3];
  return t;
}



function read_json_file(target_json_file) {
	var rawdata = fs.readFileSync(target_json_file); //mudar para Async
  var jsondata = JSON.parse(rawdata);
	return jsondata;
}

function write_json_file(target_json_file, data) {
	var data2 = JSON.stringify(data, null, 4);
	fs.writeFileSync(target_json_file, data2, finished);
	function finished(err) {
    if (err) {
      throw err;
    } else {
      console.log('Arquivo salvo…');
    }
	}
}


function get_nome_paciente(idt) {
  return get_paciente_base_nfo(idt).dados.nome;
}


function get_paciente_base_nfo(idt) {
  pacientes = read_json_file('./nfo/pacientes.json');
   for (var idx in pacientes) {
     if (pacientes[idx].identificador === idt) {
       return pacientes[idx];
     }
  }
}


function get_paciente_gineco_nfo(idt) {
  gineco_obstetricia = read_json_file("./nfo/gineco_obstetricia.json");
  for (var idx in gineco_obstetricia) {
    if (gineco_obstetricia[idx].identificador === idt) {
      return gineco_obstetricia[idx];
    }
  }  
}


function get_paciente_disfmic_nfo(idt) {
  disfunc_micc = read_json_file("./nfo/disfunc_micc.json");
  for (var idx in disfunc_micc) {
    if (disfunc_micc[idx].identificador === idt) {
      return disfunc_micc[idx];
    }
  }  
}


function get_paciente_disfproc_nfo(idt) {
  disfunc_proct = read_json_file("./nfo/disfunc_proct.json");
  for (var idx in disfunc_proct) {
    if (disfunc_proct[idx].identificador === idt) {
      return disfunc_proct[idx];
    }
  }  
}


function get_paciente_ex_compl_nfo(idt) {
  exames_complementares = read_json_file("./nfo/exames_complementares.json");
  for (var idx in exames_complementares) {
    if (exames_complementares[idx].identificador === idt) {
      return exames_complementares[idx];
    }
  }  
}


function get_paciente_ex_fis_nfo(idt) {
  exames_fisicos = read_json_file("./nfo/exames_fisicos.json");
  for (var idx in exames_fisicos) {
    if (exames_fisicos[idx].identificador === idt) {
      return exames_fisicos[idx];
    }
  }  
}



app.get('/', function(req, res){
  res.render('index', {style_sheet: ['frontpage', 'w3']});
});


app.use(function(req, res, next){
  console.log('Looking for URL : ' + req.url); // Imprime tentatvas de acesso a locais ou arquivos acessados além da raiz do site e continua...
  next();
});

  
app.use(function(err, req, res, next){
  console.log('Error : ' + err.message); // Apanha o erro, apresenta-o no console e continua...
  next();
});


app.get('/:pagina/:subpagina/:idt', function(req, res){
  if (req.params.pagina === 'form') {
    idt = req.params.idt;
    
    //Lê o arquivo JSON correspondente ao formulário selecionado e armazena as informações em fields
    if (req.params.subpagina === 'novo_paciente') {
      fields = formularios.novo_paciente;
      paciente_identificado = false;
      nome_paciente = "";

    } else if (req.params.subpagina === 'gineco_obstetricia') {
      fields = formularios.gineco_obstetricia;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else if (req.params.subpagina === 'exames_fisicos') {
      fields = formularios.exames_fisicos;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else if (req.params.subpagina === 'exames_complementares') {
      fields = formularios.exames_complementares;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else if (req.params.subpagina === 'evolucao') {
      fields = formularios.evolucao;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else if (req.params.subpagina === 'disfunc_proct') {
      fields = formularios.disfunc_proct;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else if (req.params.subpagina === 'disfunc_micc') {
      fields = formularios.disfunc_micc;
      paciente_identificado = true;
      nome_paciente = get_nome_paciente(idt);

    } else { res.render('404');}
  

    //Executa um laço para percorrer o arquivo JSON (Array/List) e carrecar os campos conforme suas propriedades
    for (var idx in fields.campos) {

      //Adiciona propriedade isTextAreaField ao objeto para renderização adequada do template.
      if (fields.campos[idx].tipo == 'textarea') {
        fields.campos[idx].isTextarea = true;

      ////Adiciona propriedade do campo e organiza opções
      } else if (fields.campos[idx].tipo == 'subt1') {
        fields.campos[idx].isSubt1 = true;

      } else if (fields.campos[idx].tipo == 'subt2') {
        fields.campos[idx].isSubt2 = true;

      } else if (fields.campos[idx].tipo == 'escala') {
        fields.campos[idx].isEscala = true;

      } else if (fields.campos[idx].tipo == 'checkbox') {
        fields.campos[idx].isCheckbox = true;
        fields.campos[idx].options = [];
        for (var iidx in fields.campos[idx].ops) {
          fields.campos[idx].options.push({ item_id: fields.campos[idx].id + iidx, item_nome: fields.campos[idx].nome, item_val: fields.campos[idx].ops[iidx] });
        }

      } else if (fields.campos[idx].tipo == 'radio-text') {
        fields.campos[idx].isRadioText = true;  
        fields.campos[idx].options = [];
        for (var iidx in fields.campos[idx].ops) {
          fields.campos[idx].options.push({ item_id: fields.campos[idx].id + iidx, item_nome: fields.campos[idx].nome, item_val: fields.campos[idx].ops[iidx] });
        }

        
      } else if (fields.campos[idx].tipo == 'radio') {
        fields.campos[idx].isRadio = true;

        fields.campos[idx].options = [];
        for (var iidx in fields.campos[idx].ops) {
          fields.campos[idx].options.push({ item_id: fields.campos[idx].id + iidx, item_nome: fields.campos[idx].nome, item_val: fields.campos[idx].ops[iidx] });
        }

      //Renderiza os demias campos como DATE/NUMBER
      } else if (fields.campos[idx].tipo == 'number') {
        fields.campos[idx].isNumber = true;
        if (fields.campos[idx].form_col_pos == 1) {
          fields.campos[idx].isFormcol1 = true;
        } else {
          fields.campos[idx].isFormcol2 = true;
        }

      } else if (fields.campos[idx].tipo == 'date') {
        fields.campos[idx].isDate = true;
        if (fields.campos[idx].form_col_pos == 1) {
          fields.campos[idx].isFormcol1 = true;
        } else {
          fields.campos[idx].isFormcol2 = true;
        }

      //Renderiza os demias campos como TEXT
      } else {
        fields.campos[idx].isText = true;
      }
    }

    //Cria um identificador para o paciente    
    if (fields.form_ref === 'n_pac') {
      t = Date().split(' ');
      idt = t[3]+t[1]+t[2]+t[4];
      idt = idt.replace(':','').replace(':','');
      //res.render('form', { style_sheet: ['frontpage', 'w3'], nome_paciente: nome_paciente, paciente_identificado: paciente_identificado, titulo: fields.titulo, entryPoint: fields.entry_point, idt: idt, descricao: fields.descricao, form_ref: fields.form_ref, campos: fields.campos, csrf: 'CSRF token here', formulario: 'ok' });
    }

    res.render('form', { style_sheet: ['frontpage', 'w3'], nome_paciente: nome_paciente, paciente_identificado: paciente_identificado, titulo: fields.titulo, entryPoint: fields.entry_point, idt: idt, descricao: fields.descricao, form_ref: fields.form_ref, campos: fields.campos, csrf: 'CSRF token here', formulario: 'ok' });
    
  } else if (req.params.pagina === 'view') {
    if (req.params.subpagina === 'listar') {
      pacientes = read_json_file('./nfo/pacientes.json');

      res.render('listar', { pacientes: pacientes, style_sheet: ['frontpage', 'w3'] } ); 

    } else if (req.params.subpagina === 'paciente') {
      idt = req.params.idt;

      paciente = get_paciente_base_nfo(idt);
      paciente_gineco_nfo = get_paciente_gineco_nfo(idt);
      paciente_disfmic = get_paciente_disfmic_nfo(idt);
      paciente_disfproc = get_paciente_disfproc_nfo(idt);
      paciente_ex_compl = get_paciente_ex_compl_nfo(idt);
      paciente_ex_fis = get_paciente_ex_fis_nfo(idt);

      res.render('ver_paciente', { 
        paciente_info_geral: paciente, 
        paciente_gineco_nfo: paciente_gineco_nfo,
        paciente_disfmic: paciente_disfmic,
        paciente_disfproc: paciente_disfproc,
        paciente_ex_fis: paciente_ex_fis, 
        paciente_ex_compl: paciente_ex_compl,  
        style_sheet: ['frontpage', 'w3'] 
      });

    } else {
      res.render('sobre', { style_sheet: ['frontpage', 'w3'] });
    }

  } else {
    res.status(404);
    res.render('404');
  }
});

app.post('/processar_formulario/:form_ref', function(req, res){ 
  //Processa formulário de acordo com a referencia
  if (req.params.form_ref === "n_pac") { //Novo paciente
    //Cria um identificador para o paciente
    idt = req.body.idt;

    var form_data = {
      identificador: idt,
      dados: {
          nome: req.body.nome,
          nome_social: req.body.nome_social,
          sexo: req.body.sexo,
          cor: req.body.cor,
          dn: req.body.dn,
          idade: req.body.idade,
          peso: req.body.peso,
          altura: req.body.altura,
          profissao: req.body.profissao,
          estado_civil: req.body.estado_civil,
          endereco: req.body.endereco,
          email: req.body.email,
          telefone: req.body.telefone,
          indicacao: req.body.indicacao,
          medico: req.body.medico,
          responsavel: req.body.responsavel,
          diagnostico: req.body.diagnostico,
          qp: req.body.qp,
          hda_hpp: req.body.hda_hpp,
          mobilidade: req.body.mobilidade,
          acp_multidis: req.body.acp_multidis,
          medicamentos: req.body.medicamentos,
          tratamentos: req.body.tratamentos,
          atividade_fisica: req.body.atividade_fisica,
          especialidades: req.body.especialidades,
          evolucoes: []
      }
    };

    //Insere dados obtidos em fast_data
    var fast_ob = {
      id: idt,
      nome: req.body.nome,
      telefone: req.body.telefone,
      email: req.body.email
    };

    fast_data.push(fast_ob);
    
    //Leitura dos arquivos de dados
    pacientes = read_json_file("./nfo/pacientes.json");
    gineco_obstetricia = read_json_file("./nfo/gineco_obstetricia.json");
    disfunc_micc = read_json_file("./nfo/disfunc_micc.json");
    disfunc_proct = read_json_file("./nfo/disfunc_proct.json");
    exames_complementares = read_json_file("./nfo/exames_complementares.json");
    exames_fisicos = read_json_file("./nfo/exames_fisicos.json");

    //Criando estrutura de pendencias para questionários subsequentes
    pend_estruct = {
      identificador: form_data.identificador,
      pend_info: true,
      dados: []
    };

    //Registro das informações iniciais no arquivo de dados pessoais dos pacientes.
    pacientes.push(form_data);
    write_json_file("./nfo/pacientes.json", pacientes);

    //Registro da estutura de verificação de pendencias nos formularios obrigatórios.
    exames_complementares.push(pend_estruct);
    exames_fisicos.push(pend_estruct);
    write_json_file("./nfo/exames_complementares.json", exames_complementares);
    write_json_file("./nfo/exames_fisicos.json", exames_fisicos);

    
    //Verifica, conforme a resposta de especialidades quais outros questionários precisam ser respondidos.
    if (req.body.especialidades.indexOf("Gineco-Obstetrícia e Disfunções Sexuais Femininas") !== -1) {
      gineco_obstetricia.push(pend_estruct);
      write_json_file("./nfo/gineco_obstetricia.json", gineco_obstetricia);      
    }

    if (req.body.especialidades.indexOf("Disfunções Miccionais") !== -1) {
      disfunc_micc.push(pend_estruct);
      write_json_file("./nfo/disfunc_micc.json", disfunc_micc);      
    }

    if (req.body.especialidades.indexOf("Disfunções proctológicas") !== -1) {
      disfunc_proct.push(pend_estruct);
      write_json_file("./nfo/disfunc_proct.json", disfunc_proct);      
    }
    res.redirect("/form_pend");
    //res.redirect(`/verificar_pendencias/?idt=${idt}`);


  } else if (req.params.form_ref === "gin_ob") {
    //Lê arquivo de dados
    gineco_obstetricia = read_json_file("./nfo/gineco_obstetricia.json");

    //Recupera o identificador enviado via GET
    idt = req.body.idt;

    //Cria um identificador para o foumulario
    t = data_format();

    var form_data = {
      datahora: t,
      menstruacao_regular: req.body.menstruacao_regular,
      menopausa: req.body.menopausa,
      vida_sexual: req.body.vida_sexual,
      vida_sexual_obs: req.body.vida_sexual_obs,
      metodo_contraceptivo: req.body.metodo_contraceptivo,
      n_gestacoes: req.body.n_gestacoes,
      n_abortos: req.body.n_abortos,
      n_partos_naturais: req.body.n_partos_naturais,
      n_cesarianas: req.body.n_cesarianas,
      parto_nfo: req.body.parto_nfo,
      parto_anestesia: req.body.parto_anestesia,
      historia_partos: req.body.historia_partos,
      peso_gestacoes: req.body.peso_gestacoes,
      peso_gestacoes_obs: req.body.peso_gestacoes_obs,
      peso_bebes: req.body.peso_bebes,
      incontinencia: req.body.incontinencia,
      incontinencia_tratamento: req.body.incontinencia_tratamento,
      cirurgias_uroginecologicas: req.body.cirurgias_uroginecologicas,
      cirurgias_uroginecologicas_obs: req.body.cirurgias_uroginecologicas_obs,
      patologias_ginecologicas: req.body.patologias_ginecologicas,
      patologias_ginecologicas_obs: req.body.patologias_ginecologicas_obs,
      disfuncoes_sexuais_femininas: req.body.disfuncoes_sexuais_femininas,
      disfuncoes_sexuais_femininas_obs: req.body.disfuncoes_sexuais_femininas_obs,
      fisiodiagnostico: req.body.fisiodiagnostico
    };
    
    for (var paciente in gineco_obstetricia) {
      if (gineco_obstetricia[paciente].identificador === idt) {
        gineco_obstetricia[paciente].pend_info = false;
        gineco_obstetricia[paciente].dados.push(form_data);
      } 
    }        

   
    //Grava alterações do arquivo de dados.
    write_json_file("./nfo/gineco_obstetricia.json", gineco_obstetricia);
    res.redirect("/form_pend");
    //res.redirect(`/verificar_pendencias/?idt=${idt}`)
    

  } else if (req.params.form_ref === "d_micc") {
    //Lê arquivo de dados
    disfunc_micc = read_json_file("./nfo/disfunc_micc.json");

    //Recupera o identificador enviado via GET
    idt = req.body.idt;

    //Cria um identificador para o foumulario
    t = data_format();

    var form_data = {
      datahora: t,
      ingesta_de_liquidos: req.body.ingesta_de_liquidos,
      tipo_bebida: req.body.tipo_bebida,
      controle_urina: req.body.controle_urina,
      enurese: req.body.enurese,
      enurese_idade: req.body.enurese_idade,
      frq_urinaria_diurna: req.body.frq_urinaria_diurna,
      frq_urinaria_noturna: req.body.frq_urinaria_noturna,
      frq_urinaria_sono: req.body.frq_urinaria_sono,
      disfunc_micc_sintomas: req.body.disfunc_micc_sintomas,
      caracteristicas_urina: req.body.caracteristicas_urina,
      caracteristicas_jato_urina: req.body.caracteristicas_jato_urina,
      stop_teste: req.body.stop_teste,
      caracteristicas_perda: req.body.caracteristicas_perda,
      situacoes_perda: req.body.situacoes_perda,
      n_protetores_dia: req.body.n_protetores_dia,
      n_protetores_noite: req.body.n_protetores_noite,
      protetores_carc_uso: req.body.protetores_carc_uso,
      protetores_tipo: req.body.protetores_tipo,
      perda_tempo: req.body.perda_tempo,
      perda_inicio: req.body.perda_inicio,
      perda_evolucao: req.body.perda_evolucao,
      tecnica_cirurgica: req.body.tecnica_cirurgica,
      tempo_de_sonda: req.body.tempo_de_sonda,
      perda_outras_nfo: req.body.perda_outras_nfo,
      radioterapia: req.body.radioterapia,
      disfunc_sexual_masc: req.body.disfunc_sexual_masc
    };

    for (var paciente in disfunc_micc) {
      if (disfunc_micc[paciente].identificador === idt) {
          disfunc_micc[paciente].pend_info = false;
          disfunc_micc[paciente].dados.push(form_data);
      } 
    }        

    
    //Grava alterações do arquivo de dados.
    write_json_file("./nfo/disfunc_micc.json", disfunc_micc);
    res.redirect("/form_pend");
    //res.redirect(`/verificar_pendencias/?idt=${idt}`);

  } else if (req.params.form_ref === "d_proct") {
    //Lê arquivo de dados
    disfunc_proct = read_json_file("./nfo/disfunc_proct.json");

    //Recupera o identificador enviado via GET
    idt = req.body.idt;

    //Cria um identificador para o foumulario
    t = data_format();

    var form_data = {
      datahora: t,
      disfunc_proct: req.body.disfunc_proct,
      inconti_anal: req.body.inconti_anal,
      tipo_de_perda: req.body.tipo_de_perda,
      momento_perda: req.body.momento_perda,
      freq_evacuatoria: req.body.freq_evacuatoria,
      reflexos: req.body.reflexos,
      bristol: req.body.bristol,
      h_evacuacoes: req.body.h_evacuacoes,
      habito_intestinal: req.body.habito_intestinal,
      alimentacao: req.body.alimentacao,
      tratamentos_ant: req.body.tratamentos_ant,
      cirurgias: req.body.cirurgias
    };

    for (var paciente in disfunc_proct) {
      if (disfunc_proct[paciente].identificador === idt) {
          disfunc_proct[paciente].pend_info = false;
          disfunc_proct[paciente].dados.push(form_data);
      } 
    }        

    //Grava alterações do arquivo de dados.
    write_json_file("./nfo/disfunc_proct.json", disfunc_proct);
    res.redirect("/form_pend");
    //res.redirect(`/verificar_pendencias/?idt=${idt}`);

  } else if (req.params.form_ref === "exam_c") {
    //Lê arquivo de dados
    exames_complementares = read_json_file("./nfo/exames_complementares.json");

    //Recupera o identificador enviado via GET
    idt = req.body.idt;

    //Cria um identificador para o foumulario
    t = data_format();

    var form_data = {
      datahora: t,
      psa_data: req.body.psa_data,
      psa_total: req.body.psa_total,
      psa_livre: req.body.psa_livre,
      peso_prostata: req.body.peso_prostata,
      biopsia: req.body.biopsia,
      colpocitologia_data: req.body.colpocitologia_data,
      colpocitologia: req.body.colpocitologia,
      urinocultura_data: req.body.urinocultura_data,
      urinocultura: req.body.urinocultura,
      urodinamica_data: req.body.urodinamica_data,
      urodinamica_curv_flux: req.body.urodinamica_curv_flux,
      urodinamica_ccm: req.body.urodinamica_ccm,
      urodinamica_complacencia: req.body.urodinamica_complacencia,
      urodinamica_sensibilidade: req.body.urodinamica_sensibilidade,
      urodinamica_estabilidade: req.body.urodinamica_estabilidade,
      urodinamica_mom_perda: req.body.urodinamica_mom_perda,
      urodinamica_mom_perda_f: req.body.urodinamica_mom_perda_f,
      urodinamica_mom_perda_m: req.body.urodinamica_mom_perda_m,
      urodinamica_press_p: req.body.urodinamica_press_p,
      urodinamica_res_pm: req.body.urodinamica_res_pm,
      urodinamica_elet_reflex: req.body.urodinamica_elet_reflex,
      urodinamica_sinerg_esv: req.body.urodinamica_sinerg_esv,
      urodinamica_conclusao: req.body.urodinamica_conclusao,
      diario_mic1_data: req.body.diario_mic1_data,
      diario_mic1_fd: req.body.diario_mic1_fd,
      diario_mic1_fn: req.body.diario_mic1_fn,
      diario_mic1_ingest_hid: req.body.diario_mic1_ingest_hid,
      diario_mic1_elimin: req.body.diario_mic1_elimin,
      diario_mic1_menor: req.body.diario_mic1_menor,
      diario_mic1_maior: req.body.diario_mic1_maior,
      diario_mic1_urgencia: req.body.diario_mic1_urgencia,
      diario_mic1_s_perda: req.body.diario_mic1_s_perda,
      diario_mic1_t_protetores: req.body.diario_mic1_t_protetores,
      diario_mic1_n_protetores: req.body.diario_mic1_n_protetores,
      diario_mic1_uri_vont: req.body.diario_mic1_uri_vont,
      diario_mic1_rpm: req.body.diario_mic1_rpm,
      diario_mic2_data: req.body.diario_mic2_data,
      diario_mic2_fd: req.body.diario_mic2_fd,
      diario_mic2_fn: req.body.diario_mic2_fn,
      diario_mic2_ingest_hid: req.body.diario_mic2_ingest_hid,
      diario_mic2_elimin: req.body.diario_mic2_elimin,
      diario_mic2_menor: req.body.diario_mic2_menor,
      diario_mic2_maior: req.body.diario_mic2_maior,
      diario_mic2_urgencia: req.body.diario_mic2_urgencia,
      diario_mic2_s_perda: req.body.diario_mic2_s_perda,
      diario_mic2_t_protetores: req.body.diario_mic2_t_protetores,
      diario_mic2_n_protetores: req.body.diario_mic2_n_protetores,
      diario_mic2_uri_vont: req.body.diario_mic2_uri_vont,
      diario_mic2_rpm: req.body.diario_mic2_rpm,
      diario_mic3_data: req.body.diario_mic3_data,
      diario_mic3_fd: req.body.diario_mic3_fd,
      diario_mic3_fn: req.body.diario_mic3_fn,
      diario_mic3_ingest_hid: req.body.diario_mic3_ingest_hid,
      diario_mic3_elimin: req.body.diario_mic3_elimin,
      diario_mic3_menor: req.body.diario_mic3_menor,
      diario_mic3_maior: req.body.diario_mic3_maior,
      diario_mic3_urgencia: req.body.diario_mic3_urgencia,
      diario_mic3_s_perda: req.body.diario_mic3_s_perda,
      diario_mic3_t_protetores: req.body.diario_mic3_t_protetores,
      diario_mic3_n_protetores: req.body.diario_mic3_n_protetores,
      diario_mic3_uri_vont: req.body.diario_mic3_uri_vont,
      diario_mic3_rpm: req.body.diario_mic3_rpm,
      info_complement: req.body.info_complement,
      handcap: req.body.handcap,
      dcaf: req.body.dcaf,
      proposta: req.body.proposta
    };   

    for (var paciente in exames_complementares) {
      if (exames_complementares[paciente].identificador === idt) {
          exames_complementares[paciente].pend_info = false;
          exames_complementares[paciente].dados.push(form_data);
      } 
    }        

    //Grava alterações do arquivo de dados.
    write_json_file("./nfo/exames_complementares.json", exames_complementares);
    res.redirect("/form_pend");
    //res.redirect(`/verificar_pendencias/?idt=${idt}?nome=${idt}`);

  } else if (req.params.form_ref === "exam") {
    //Lê arquivo de dados
    exames_fisicos = read_json_file("./nfo/exames_fisicos.json");

    //Recupera o identificador enviado via GET
    idt = req.body.idt;

    //Cria um identificador para o foumulario
    t = data_format();

    var form_data = {
      datahora: t,
      regiao_abdominal: req.body.regiao_abdominal,
      regiao_abdominal_obs: req.body.regiao_abdominal_obs,
      pad_resp: req.body.pad_resp,
      inspecao_ano_vulv_obs: req.body.inspecao_ano_vulv_obs,
      inspecao_himem: req.body.inspecao_himem,
      inspecao_labios: req.body.inspecao_labios,
      inspecao_vulva: req.body.inspecao_vulva,
      inspecao_cicatriz: req.body.inspecao_cicatriz,
      sensibilidade: req.body.sensibilidade,
      sensibilidade_regiao: req.body.sensibilidade_regiao,
      sensibilidade_obs: req.body.sensibilidade_obs,
      reflexos_anocut: req.body.reflexos_anocut,
      reflexos_bol: req.body.reflexos_bol,
      valsalva: req.body.valsalva,
      valsalva_c_tend: req.body.valsalva_c_tend,
      valsalva_prolap: req.body.valsalva_prolap,
      toque: req.body.toque,
      tonus_rep: req.body.tonus_rep,
      stretch_reflexo: req.body.stretch_reflexo,
      contracao: req.body.contracao,
      afa_oxford: req.body.afa_oxford,
      afa_oxford_power: req.body.afa_oxford_power,
      afa_oxford_endurance: req.body.afa_oxford_endurance,
      afa_oxford_rep: req.body.afa_oxford_rep,
      afa_oxford_fast: req.body.afa_oxford_fast,
      ect: req.body.ect,
      perda_urinaria: req.body.perda_urinaria,
      perda_urinaria_obs: req.body.perda_urinaria_obs,
      procto: req.body.procto,
      for_esfincter_ex12: req.body.for_esfincter_ex12,
      for_esfincter_ex3: req.body.for_esfincter_ex3,
      for_esfincter_ex6: req.body.for_esfincter_ex6,
      for_esfincter_ex9: req.body.for_esfincter_ex9,
      for_puboretal: req.body.for_puboretal,
      tonus_repouso_EAI: req.body.tonus_repouso_EAI,
      reflexo_reto_anal: req.body.reflexo_reto_anal
    };    

    for (var paciente in exames_fisicos) {
      if (exames_fisicos[paciente].identificador === idt) {
          exames_fisicos[paciente].pend_info = false;
          exames_fisicos[paciente].dados.push(form_data);
      } 
    }        


    //Grava alterações do arquivo de dados.
    write_json_file("./nfo/exames_fisicos.json", exames_fisicos);
    res.redirect("/form_pend");
    //res.redirect("/");

  } else if (req.params.form_ref === "evo") {
    idt = req.body.idt;

    t = data_format();

    var form_data = {
      datahora: t,
      evolucao_nfo: req.body.evolucao_nfo
    };

    pacientes = read_json_file("./nfo/pacientes.json");

    for (var p in pacientes) {
      if (pacientes[p].identificador === idt) {
          pacientes[p].dados.evolucoes.push(form_data);
      } 
    }

    write_json_file("./nfo/pacientes.json", pacientes);

    res.redirect("/view/paciente/"+idt);

  } else {
    res.send("Rotina não configurada...");
  }

});


app.get('/form_pend', function(req, res) {
  gineco_obstetricia = read_json_file("./nfo/gineco_obstetricia.json");
  disfunc_micc = read_json_file("./nfo/disfunc_micc.json");
  disfunc_proct = read_json_file("./nfo/disfunc_proct.json");
  exames_complementares = read_json_file("./nfo/exames_complementares.json");
  exames_fisicos = read_json_file("./nfo/exames_fisicos.json");
  listagem = [];

  pendencia_existe = false;

  for (var paciente in gineco_obstetricia) {
    if (gineco_obstetricia[paciente].pend_info === true) {
      pendencia_existe = true;
      for (var paciente_global_doc in fast_data) {
        if ( fast_data[paciente_global_doc].id === gineco_obstetricia[paciente].identificador ) {
          line = {
            nome: fast_data[paciente_global_doc].nome,
            identificador: gineco_obstetricia[paciente].identificador,
            tipo_formulario: "Gineco obstetrícia",
            subpagina: "gineco_obstetricia"
          };
          listagem.push(line);
        }
      }
    }
  }

  for (var paciente in disfunc_micc) {
    if (disfunc_micc[paciente].pend_info === true) {
      pendencia_existe = true;
      var idt = disfunc_micc[paciente].identificador;
      for (var paciente_global_doc in fast_data) {
        if ( fast_data[paciente_global_doc].id == idt ) {
          line = {
            nome: fast_data[paciente_global_doc].nome,
            identificador: idt,
            tipo_formulario: "Disfunção miccional",
            subpagina: "disfunc_micc"
          };
          listagem.push(line);
        }
      }
    }
  }

  for (var paciente in disfunc_proct) {
    if (disfunc_proct[paciente].pend_info === true) {
      pendencia_existe = true;
      var idt = disfunc_proct[paciente].identificador;
      for (var paciente_global_doc in fast_data) {
        if ( fast_data[paciente_global_doc].id == idt ) {
          line = {
            nome: fast_data[paciente_global_doc].nome,
            identificador: idt,
            tipo_formulario: "Disfunção proctológica",
            subpagina: "disfunc_proct"
          };
          listagem.push(line);
        }
      }
    }
  }

  for (var paciente in exames_complementares) {
    if (exames_complementares[paciente].pend_info === true) {
      pendencia_existe = true;
      var idt = exames_complementares[paciente].identificador;
      for (var paciente_global_doc in fast_data) {
        if ( fast_data[paciente_global_doc].id == idt ) {
          line = {
            nome: fast_data[paciente_global_doc].nome,
            identificador: idt,
            tipo_formulario: "Exames complementares",
            subpagina: "exames_complementares"
          };
          listagem.push(line);
        }
      }
    }
  }
  
  for (var paciente in exames_fisicos) {
    if (exames_fisicos[paciente].pend_info === true) {
      pendencia_existe = true;
      var idt = exames_fisicos[paciente].identificador;
      for (var paciente_global_doc in fast_data) {
        if ( fast_data[paciente_global_doc].id == idt ) {
          line = {
            nome: fast_data[paciente_global_doc].nome,
            identificador: idt,
            tipo_formulario: "Exames físicos",
            subpagina: "exames_fisicos"
          };
          listagem.push(line);
        }
      }
    }
  }
  if ( pendencia_existe === true ) {
    res.render('listar_pendencias', { pacientes: listagem, style_sheet: ['frontpage', 'w3'] } );
  } else {
    res.redirect('/');
  }
});


// Defines a custom 404 Page and we use app.use because the request didn't match a route (Must follow the routes)

app.use(function(req, res) {
  // Define the content type
  res.type('text/html');

  // The default status is 200
  res.status(404);

  // Point at the 404.handlebars view
  res.render('404', { style_sheet: ['frontpage', 'w3'] });
});


// Custom 500 Page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);

  // Point at the 500.handlebars view
  res.render('500', { style_sheet: ['frontpage', 'w3'] });
});

var port = app.get('port');

app.listen(port, function(){
  console.log("Node.JS App iniciado em http://localhost:"+port+"/ aperte Ctrl-C para fechar.");
});
